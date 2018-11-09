# startupMapCrawlers
use this tool to extract ALL emails from [mappedinisrael](https://mappedinisrael.com/) the biggest list for Israeli startups! 

## to use
you need to have Node installed - you can download it from [here](https://nodejs.org/en/download/)

then simply run 

You have two options to run this script. The first is to run the wide one which will crawl all links there is available to it , you can do it by running:

```sh
$ git clone https://github.com/obiwankenoobi/startupMapCrawlers.git
$ cd path/to/file
$ npm install
$ node --max-old-space-size=8192 lib.js   
```

It will crawl and add all emails to new file called `emails.txt`

You also can run the sniper mode which only crawl and add emails with the name of the startup in it. You can do it by running
```sh
$ git clone https://github.com/obiwankenoobi/startupMapCrawlers.git
$ cd path/to/file
$ npm install
$ node --max-old-space-size=8192 libSniper.js   
```
It will save the results to `emailsSniper.txt`

In later versions I will add auto email to the extractet emails. Meanwhile enjoy this (: