var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/urllist', function(req, res ) {
  var db = req.db;
  var collection = db.get('tokens');
  collection.find({},{}, function(e,docs) {
    res.json(docs);
  });
});

module.exports = router;
