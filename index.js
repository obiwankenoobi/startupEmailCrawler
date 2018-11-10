#!/usr/bin/env node

const start = require("./lib/lib");
const program = require("commander");

program.version("0.0.1").description("extract startups emails in ease!");

program
  .arguments("<mode> <country>")
  .description("start crawling the web!")
  .action((mode, country) => {
    if (mode != "sniper" && mode != "reg") {
      return console.log("mode can be `reg` or `sniper`");
    }
    if (country != "usa" && country != "israel") {
      return console.log("country can be 'israel' or `usa`");
    } else {
      start(mode, country);
    }
  });

program.parse(process.argv);
