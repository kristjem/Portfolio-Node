var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET portfolio page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { title: 'Portfolio', cakes: JSON.parse(data) });
});

module.exports = router;
