# startupEmailCrawler
use this tool to extract ALL emails from [mappedinisrael](https://mappedinisrael.com/) the biggest list for Israeli startups! 

## to use
you need to have Node installed - you can download it from [here](https://nodejs.org/en/download/)

then

```sh
$ git clone https://github.com/obiwankenoobi/startupMapCrawlers.git
$ cd path/to/file
$ npm run build 
```
now after you cloned and installed the tool you have 2 options to run the script:

### `--reg <country>`
```sh 
crawler --reg <country>
``` 
will start the script on regular mode. It means the crawler will run through any link there is available to it which will result in more emails but can contain some emails not related to the actual startup.

### `--sniper <country>` **recommended**
```sh
crawler --sniper <country>
``` 
will start the script on sniper mode which will only crawl links related to the name of the startup which will result in less emails but all will be related to the actual startup it crawled.


### `<country>`

the `<country>` argument will tell the tool which country you want to crawl. For now we support the countries below:
* `usa`
* `israel`

example for execution:

```sh
crawler sniper usa
```

In later versions I will add auto email to the extractet emails. Meanwhile enjoy this (: