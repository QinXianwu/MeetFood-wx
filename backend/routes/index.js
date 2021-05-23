var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
	// console.log(req.body);//获取参数
});

module.exports = router;
