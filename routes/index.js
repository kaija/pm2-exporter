var express = require('express');
var router = express.Router();
var http = require('http');
var scratch = require('../scratch.js');

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  res.redirect('/metrics');
});

router.get('/metrics', function(req, res, next) {
  scratch.collect(function(data){
    res.set('Content-Type', 'text/plain');
    var out = "";
    for (var i in data) {
      var m=i.replace(/\./g, '_');
      out += m + " " + data[i] + "\n";
    }
    res.send(out);
  });
});

module.exports = router;
