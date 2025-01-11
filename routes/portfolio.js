var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var request = require('request');

/* GET portfolio page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { title: 'Portfolio', cakes: JSON.parse(data) });
});

/* POST portfolio page. */
router.post('/', jsonParser, function(req, res, next) {
  const expectedAtributes = ['url', 'name', 'alt', 'category', 'header', 'description'];
  Object.keys(req.body).forEach(key => {
    if(!expectedAtributes.includes(key)) {
      return res.status(400).end('Invalid parameter: ' + key);
    }
    else if(req.body[key] === '') {
      return res.status(400).end(key + " must have a str value");
      }
    });
    if (req.body.url == null || req.body.name == null) {
      return res.status(400).end('url and name are required');
    }
    if (req.body.category != null) {
      if (!(["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category))) {
        return res.status(400).end('Invalid category provided');
    }
  }

  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    console.log('downloading image');
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body]);
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray, null, 2));
  }
  res.end();
});

/* DELETE portfolio page. */
router.delete('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
  if(newArray.length !== portfoliosArray.length) {
    fs.unlink(path.resolve(__dirname, '../data/img/'+ req.body.name), () => {
      console.log(req.body.name + " deleted!");
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray, null, 2));
  }
  res.end();
});

var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    console.log(`downloading ${url} to ${filename}`);
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};

module.exports = router;
