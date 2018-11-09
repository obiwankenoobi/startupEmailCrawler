

const sniper = require("./libSniper")
const regular = require("./lib")

if (process.argv[2] == "--sniper") {
    sniper()
}
else if (process.argv[2] == "--reg") {
    regular()
} 
else {
    console.log("please choose mode (--reg or --sniper)")
}


