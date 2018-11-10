const start = require("./lib/lib");



switch (process.argv[2]) {
  case "--sniper":
    start();
    break;
  case "--reg":
    start();
    break;
  default:
    console.log("please choose mode (--reg or --sniper)");
}
