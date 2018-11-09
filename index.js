

const sniper = require("./lib/sniper")
const regular = require("./lib/regular")

if (process.argv[2] == "--sniper") {
    sniper()
}
else if (process.argv[2] == "--reg") {
    regular()
} 
else {
    console.log("please choose mode (--reg or --sniper)")
}


