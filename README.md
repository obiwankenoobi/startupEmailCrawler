# startupMapCrawlers
use this tool to extract ALL emails from [mappedinisrael](https://mappedinisrael.com/) the biggest list for Israeli startups! 

## to use
you need to have Node installed - you can download it from [here](https://nodejs.org/en/download/)

then simply run 

```sh
$ git clone https://github.com/obiwankenoobi/startupMapCrawlers.git
$ cd path/to/file
$ npm install
$ node --max-old-space-size=8192 lib.js   
```

It will crawl and add all emails to new file called `emails.txt`

In later versions I will add auto email to the extractet emails. Meanwhile enjoy this (: