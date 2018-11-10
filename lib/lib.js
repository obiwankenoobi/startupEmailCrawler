const request = require("request");
const cheerio = require("cheerio");
const exec = require("child_process").exec;
const ProgressBar = require("progress");
const wordsToIgnore = require("./wordsToIgnore")

let emails = [];
let visited = [];

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

function getLink(url, tags, depth, startupName, mode, country) {
  /**
   ** @ { prop:String } url - the url to crawl
   ** @ { prop:String } tags - the tags to get
   ** @ { prop:Number } depth - how deep we crawled
   ** @ { prop:String } startupName - the name of the startup so the crawler only go to links with that string in it
   ** @ { prop:String } mode - the mode of the crawler (sniper / reg)
   ** @ { prop:String } country - the coutry to crawl
   */

  try {
    let body = "";
    request
      .get(url)
      .on("data", chunk => {
        body += chunk;
      })
      .on("end", () => {
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
                }
              } else if (link.includes("http") && !link.includes("about.me")) {
                // if link isnt email
                const isVisited = visited.find(i => i == link);

                let maxDepth;
                switch (country) {
                  case "global":
                    maxDepth = 3;
                    break;
                  case "israel":
                    maxDepth = 2;
                    break;
                  default:
                    maxDepth = 0;
                }

                if (depth < maxDepth) {
                  // if depth is less then 2 levels
                  if (!isVisited || visited.length == 0) {
                    // if link isnt visited
                    console.log("going to:", link);
                    visited.push(link); // push to visited linkes
                    return setTimeout(
                      getLink,
                      index * 1000,
                      link,
                      "a",
                      depth++,
                      startupName,
                      mode,
                      country
                    );
                  }
                }
              }
            }
          }
        });
      })
      .on("error", e => {});
  } catch (e) {}
}

module.exports = (mode, country) => {
  let baseURL = "";
  switch (country) {
    case "global":
      baseURL = "https://www.startups-list.com";
      break;
    case "israel":
      baseURL = "http://mappedinisrael.com/all-companies";
      break;
    default:
      return;
  }

  process.on("uncaughtException", err => {
    console.log(err);
  });

  if (mode == "sniper") {
    console.log("starting crawling on sniper mode...");
  } else {
    console.log("starting crawling on regular mode...");
  }

  let body = "";
  request.get(baseURL).on("response", res => {
    res.on("data", chunk => {
      body += chunk;
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
        let tags = "";
        switch (country) {
          case "global":
            tags = "a";
            break;
          case "israel":
            tag = ".mapme_company a";
            break;
          default:
            "a";
        }

        setTimeout(
          getLink,
          index * 1000,
          i.attribs.href,
          tags,
          0,
          startupName,
          mode,
          country
        );
      });
    });
    res.on("error", e => console.log("error:", e));
  });
};
