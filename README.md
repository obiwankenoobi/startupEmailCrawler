# startupMapCrawlers
use this tool to extract ALL emails from [mappedinisrael](https://mappedinisrael.com/) the biggest list for Israeli startups! 

## to use
you need to have Node installed - you can download it from [here](https://nodejs.org/en/download/)

then

```sh
$ git clone https://github.com/obiwankenoobi/startupMapCrawlers.git
$ cd path/to/file
$ npm install 
```
now after you cloned the library you have 2 options to run the script:

### `--reg`
`node index.js --reg` will start the script on regular mode. It means the crawler will run through any link there is available to it which will result in more emails but can contain some emails not related to the actual startup.

### `--sniper` **recommended**
`node index.js --sniper` will start the script on sniper mode which will only crawl links related to the name of the startup which will result in less emails but all will be related to the actual startup it crawled.

In later versions I will add auto email to the extractet emails. Meanwhile enjoy this (: