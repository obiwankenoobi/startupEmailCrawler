const request = require("request");
const cheerio = require("cheerio");
const exec = require("child_process").exec;
const ProgressBar = require("progress");
const wordsToIgnore = require("./wordsToIgnore");

let emails = [];
let visited = [];
let count = 0;

let maxDepth;

let maxCallsInASite;

let baseURL = "";

let tags = "";

function progressBar(length) {
  const bar = new ProgressBar(":bar", { total: length });
  const timer = setInterval(function() {
    bar.tick();
    if (bar.complete) {
      console.log("Get yourself a ☕.. it might take a while!\n");
      clearInterval(timer);
    }
  }, 3);
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function getLink(
  url,
  tags,
  depth,
  startupName,
  mode,
  country,
  numberOfCallsInASite
) {
  /**
   ** @ { prop:String } url - the url to crawl
   ** @ { prop:String } tags - the tags to get
   ** @ { prop:Number } depth - how deep we crawled
   ** @ { prop:String } startupName - the name of the startup so the crawler only go to links with that string in it
   ** @ { prop:String } mode - the mode of the crawler (sniper / reg)
   ** @ { prop:String } country - the coutry to crawl
   ** @ { prop:Number } numberOfCallsInASite - the number of times we made a call in a single site
   */

  let body = "";

  try {
    request.get(url).on("response", res => {
      res.on("error", e => {
        console.log("error loading page");
        exec(`echo getLink: ${e}, >>  logs--errors.log`);
      });

      res.on("data", chunk => {
        body += chunk;
      });

      res.on("close", () => {
        console.log("connection closed");
      });

      res.on("end", () => {
        const page = cheerio.load(body);
        const li = page(tags);
        const liArr = Array.from(li);

        liArr.map((i, index) => {
          let toIgnore = false;
          if (i.attribs.href) {
            for (let item = 0; item < wordsToIgnore.length; item++) {
              if (i.attribs.href.includes(wordsToIgnore[item])) {
                toIgnore = true;
                break;
              }
            }
          }

          if (i.attribs.href && toIgnore == false) {
            const link = i.attribs.href
              .replace("mailto:", "")
              .replace("%20", "")
              .toLowerCase();

            if (link) {
              // if link exist
              if (validateEmail(link)) {
                // if link is valid email
                const exist = emails.find(i => i == link);
                if (!exist) {
                  // if email not saved yet
                  if (mode == "sniper") {
                    exec(`echo ${link}, >> emailsSniper--${country}.txt`);
                  } else {
                    exec(`echo ${link}, >> emails--${country}.txt`);
                  }

                  emails.push(link);
                  console.log("found one!", link);
                  return;
                }
              } else {
                if (
                  link.includes("http") &&
                  !link.includes("about.me") &&
                  link.includes(startupName)
                ) {
                  // if link isnt email
                  const isVisited = visited.find(i => i == link);

                  if (!isVisited || visited.length == 0) {
                    if (
                      depth < maxDepth &&
                      numberOfCallsInASite < maxCallsInASite
                    ) {
                      numberOfCallsInASite++;
                      visited.push(link); // push to visited linkes
                      count++;
                      console.log(
                        `[${count}] call No: ${numberOfCallsInASite} => ${link}`
                      );

                      return setTimeout(
                        async () =>
                          await getLink(
                            link,
                            "a",
                            depth++,
                            startupName,
                            mode,
                            country,
                            numberOfCallsInASite
                          ),
                        index * 1000
                      );
                    }
                  }
                }
              }
            }
          }
        });
      });
    });
  } catch (e) {
    exec(`echo getLink: ${e}, >>  logs--errors.log`);
    console.log("error in request");
  }
}

module.exports = (mode, country) => {
  switch (country) {
    case "global":
      maxDepth = 3;
      maxCallsInASite = 30;
      baseURL = "https://www.startups-list.com";
      tags = "a";
      break;
    case "israel":
      maxDepth = 2;
      maxCallsInASite = 30;
      baseURL = "http://mappedinisrael.com/all-companies";
      tags = ".mapme_company a";
      break;
    default:
      maxDepth = 0;
      maxCallsInASite = 0;
      tags = "a";
  }

  process.on("uncaughtException", err => {
    exec(`echo uncaughtException: ${err}, >>  logs--errors.log`);
    return;
  });

  process.on("exit", err => {
    exec(`echo process exit, >>  logs--errors.log`);
    return;
  });

  if (mode == "sniper") {
    console.log("starting crawling on sniper mode...");
  } else {
    console.log("starting crawling on regular mode...");
  }

  let body = "";
  request.get(baseURL).on("response", res => {
    res.on("error", e => console.log("error:", e));

    res.on("data", chunk => {
      body += chunk;
    });

    res.on("close", () => {
      console.log("connection closed");
    });

    res.on("end", () => {
      const page = cheerio.load(body);
      const li = page("a");
      const liArr = Array.from(li);

      progressBar(liArr.length);

      liArr.map((i, index) => {
        let startupName = "";
        if (mode == "sniper" && country == "israel") {
          startupName = i.attribs.href.split("company/")[1];
          if (startupName) {
            startupName = startupName.toLowerCase();
            if (startupName.includes("_")) {
              startupName = startupName.split("_")[0];
            }
          }
        }

        return setTimeout(
          getLink,
          index * 1000,
          i.attribs.href,
          tags,
          0,
          startupName,
          mode,
          country,
          0
        );
      });
    });
  });
};
