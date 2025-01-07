var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  res.render('home', { title: 'Home', array: JSON.parse(data)});
});

/* POST home page. */
// router.post parameters: path, middleware, callback (req, res, next):
router.post('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  let array = JSON.parse(rawdata); // JSON.parse converts a string to a JavaScript object
  const newArray = array.concat([req.body.newText]) //.concat() method is used to merge two or more arrays
  fs.writeFileSync(path.resolve(__dirname, "../data/introductionArray.json"), JSON.stringify(newArray));
  res.end();
});

module.exports = router;