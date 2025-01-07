var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  let array = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('index', { title: 'Express' , array: JSON.parse(array), data: JSON.parse(data)});
});

module.exports = router;