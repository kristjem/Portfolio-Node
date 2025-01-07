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
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body]);
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray, null, 2));
  }
  res.end();
});

var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};

module.exports = router;
