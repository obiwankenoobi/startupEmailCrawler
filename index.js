const sniper = require("./lib/sniper");
const regular = require("./lib/regular");

switch (process.argv[2]) {
  case "--sniper":
    sniper();
    break;
  case "--reg":
    regular();
    break;
  default:
    console.log("please choose mode (--reg or --sniper)");
}
