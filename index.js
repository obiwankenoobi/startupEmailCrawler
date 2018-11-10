const start = require("./lib/lib");

switch (process.argv[2]) {
  case "--sniper":
    switch (process.argv[3]) {
      case "--usa":
        start("https://www.startups-list.com");
        break;
      case "--israel":
        start("http://mappedinisrael.com/all-companies");
        break;
      default:
        console.log("please choose a country (--usa or --israel)");
    }
    break;
  case "--reg":
    switch (process.argv[3]) {
      case "--usa":
        start("https://www.startups-list.com");
        break;
      case "--israel":
        start("http://mappedinisrael.com/all-companies");
        break;
      default:
        console.log("please choose a country (--usa or --israel)");
    }
    break;
  default:
    console.log("choose mode (--reg or --sniper)");
}
