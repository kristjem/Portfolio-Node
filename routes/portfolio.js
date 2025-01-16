var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var request = require('request');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

/* GET portfolio page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { title: 'Portfolio', cakes: JSON.parse(data) });
});

/* POST portfolio page. */
router.post('/', jsonParser, async function(req, res, next) {
  // VALIDATION
  // Set the alt attribute equal to the name attribute
  if (req.body.alt == null && req.body.name != null) {
    req.body.alt = req.body.name;
  }
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

  // WHEN VALID DATA:
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if (portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    console.log('await downloading image');
    try {
      await download(req.body.url, req.body.name);
      console.log('Download done');
      const newArray = portfoliosArray.concat([req.body]);
      fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray, null, 2));
      res.status(200).json({ success: true, message: 'Resource added' });
    } catch (error) {
      console.error('Error downloading image:', error);
      res.status(500).json({ success: false, message: 'Error downloading image' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Resource already exists' });
  }
});

/* DELETE portfolio page. */
router.delete('/', jsonParser, ensureLoggedIn, function(req, res, next) {
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

function download(url, filename) {
  return new Promise((resolve, reject) => {
    request.head(url, function(err, res, body) {
      if (err) {
        return reject(err);
      }
      console.log(`downloading ${url} to ${filename}`);
      request(url)
        .pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/' + filename)))
        .on('close', resolve)
        .on('error', reject);
    });
  });
}

module.exports = router;
