var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/metrics', function(req, res, next) {
  res.send("OK");
});

module.exports = router;
