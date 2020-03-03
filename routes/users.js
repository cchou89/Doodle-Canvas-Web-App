var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(request, response, next) {
  response.render('home');
});

module.exports = router;
