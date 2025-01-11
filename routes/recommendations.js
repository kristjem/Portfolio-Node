var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { title: 'Recommendations', data: JSON.parse(data)
 });
});

router.post('/', jsonParser, function(req, res, next) {
  // Validation of the request body
  const expectedAttributes = ['avatar', 'name', 'role', 'description'];
  
  for (const key of Object.keys(req.body)) {
    if (!expectedAttributes.includes(key)) {
      return res.status(400).end('Invalid parameter: ' + key);
    }
    if (req.body[key] === '' && key !== 'avatar') {
      return res.status(400).end(key + " must have a string value");
    }
    if (key === 'avatar') {
      if (!req.body[key] || req.body[key] < 1 || req.body[key] > 3) {
        return res.status(400).end('avatar must have an int value from 1 to 3');
      }
    }
  }

  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  if(recommendationsArray.filter(x => x.name === req.body.name).length == 0) {
    const newArray = recommendationsArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray, null, 2));
  }
  res.end();
});

router.delete('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  // In effect deleting the recommendation with the name that matches the name in the request body
  const newArray = recommendationsArray.filter(x => x.name !== req.body.name)
  if (newArray.length !== recommendationsArray.length ) {
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray, null, 2));
  }
  res.end();
});

module.exports = router;