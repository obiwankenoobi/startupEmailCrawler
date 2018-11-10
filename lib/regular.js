const request = require("request");
const cheerio = require("cheerio");
const exec = require("child_process").exec;

function regular() {
  process.on("uncaughtException", function(err) {
    console.log(err);
  });
  console.log("starting crawling on regular mode...");
  //const target = fs.createWriteStream("page.html");
  let body = "";
  request
    .get("http://mappedinisrael.com/all-companies")

    .on("data", chunk => {
      //console.log("writing...");
      body += chunk;
      //target.write(chunk);
    })
    .on("end", () => {
      //console.log("done (:");

      const page = cheerio.load(body);

      const li = page("a");
      const liArr = Array.from(li);
      liArr.map((i, index) => {
        const startupName = i.attribs.href.split(".")[1];
        setTimeout(
          getLink,
          index * 1000,
          i.attribs.href,
          ".mapme_company a",
          0,
          startupName
        );
      });
    })
    .on("error", e => console.log("error:", e));

  let emails = [];
  let visited = [];

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function getLink(url, tags, depth) {
    /**
     ** @ { prop:String } url - the url to crawl
     ** @ { prop:String } tags - the tags to get
     ** { prop:Number } depth - how deep we crawled
     */
    //let depth = 0;
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
          //console.log(li)
          const liArr = Array.from(li);
          liArr.map((i, index) => {
            if (
              i.attribs.href &&
              !i.attribs.href.includes("facebook") &&
              !i.attribs.href.includes("linkedin") &&
              !i.attribs.href.includes("twitter")
            ) {
              const link = i.attribs.href
                .replace("mailto:", "")
                .replace("%20", "")
                .toLowerCase();
              const startupName = link.split(".")[1];

              if (link) {
                // if link exist
                if (validateEmail(link)) {
                  // if link is valid email

                  const exist = emails.find(i => i == link);

                  if (!exist) {
                    // if email not saved yet
                    exec(`echo ${link}, >> emails.txt`);
                    emails.push(link);
                    console.log(link);
                  }
                } else if (
                  link.includes("http") &&
                  !link.includes("about.me")
                ) {
                  // if link isnt email

                  const isVisited = visited.find(i => i == link);

                  if (depth < 2) {
                    // if depth is less then 3 levels
                    if (!isVisited || visited.length == 0) {
                      // if link isnt visited
                      console.log("going to:", link);
                      visited.push(link); // push to visited linkes
                      return setTimeout(
                        getLink,
                        index * 1000,
                        link,
                        "a",
                        depth++
                      );
                    }
                  }
                }
              }
              {
              }
            }
          });
        })
        .on("error", e => {});
    } catch (e) {}
  }
}

module.exports = regular;
