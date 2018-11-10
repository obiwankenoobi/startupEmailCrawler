const request = require("request");
const cheerio = require("cheerio");
const exec = require("child_process").exec;
const ProgressBar = require("progress");
// const program = require("commander");

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

function getLink(url, tags, depth, startupName) {
  /**
   ** @ { prop:String } url - the url to crawl
   ** @ { prop:String } tags - the tags to get
   ** @ { prop:Number } depth - how deep we crawled
   ** @ { prop:String } startupName - the name of the startup so the crawler only go to links with that string in it
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

          if (
            i.attribs.href &&
            i.attribs.href.toLowerCase().includes(startupName) &&
            !i.attribs.href.includes("facebook") &&
            !i.attribs.href.includes("linkedin") &&
            !i.attribs.href.includes("indeed") &&
            !i.attribs.href.includes("reddit") &&
            !i.attribs.href.includes("mailchimp") &&
            !i.attribs.href.includes("google") &&
            !i.attribs.href.includes("crunchbase") &&
            !i.attribs.href.includes("microsoft") &&
            !i.attribs.href.includes("youtube") &&
            !i.attribs.href.includes("bitly") &&
            !i.attribs.href.includes("github") &&
            !i.attribs.href.includes("medium") &&
            !i.attribs.href.includes("checkpoint") &&
            !i.attribs.href.includes("myfavouritemagazines") &&
            !i.attribs.href.includes("instagram") &&
            !i.attribs.href.includes("twitter")
          ) {
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
                  if (process.argv[2] == "--sniper") {
                    exec(`echo ${link}, >> emailsSniper${process.argv[3]}.txt`);
                  } else {
                    exec(`echo ${link}, >> emails${process.argv[3]}.txt`);
                  }

                  emails.push(link);
                  console.log(link);
                }
              } else if (link.includes("http") && !link.includes("about.me")) {
                // if link isnt email
                const isVisited = visited.find(i => i == link);
                const maxDepth = process.argv[3] == "--israel" ? 2 : 3;
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
                      startupName
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

module.exports = baseURL => {
  console.log("baseURL:", baseURL);
  process.on("uncaughtException", err => {
    console.log(err);
  });

  if (process.argv[2] == "--sniper") {
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
        if (process.argv[2] == "--sniper" && process.argv[3] == "--israel") {
          startupName = i.attribs.href.split("company/")[1];
          if (startupName) {
            startupName = startupName.toLowerCase();
            if (startupName.includes("_")) {
              startupName = startupName.split("_")[0];
            }
          }
        }
        const tags = process.argv[3] == "--israel" ? ".mapme_company a" : "a";
        setTimeout(getLink, index * 1000, i.attribs.href, tags, 0, startupName);
      });
    });
    res.on("error", e => console.log("error:", e));
  });
};
