var express = require('express');
var router = express.Router();


function getIp(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

function logdb(type, req, id) {

    var db = req.db;
    var date = Date();
    var ip = getIp(req);
    var collection = db.get('logs');
    collection.insert(
       {
           "type": type,
           "id": id,
           "date": date,
           "ip": ip
       },
       function (err, doc) {
           if (err) {
               return false;   // no error
           } else {
               return true;   // error inserting
           }
       });
}

/* GET users listing. */
router.get('/urllist', function(req, res ) {
  var db = req.db;
  var collection = db.get('tokens');
  collection.find({},{}, function(e,docs) {
    res.json(docs);
  });
});


/*
 * DELETE to deleteuser.
 */
router.delete('/deleteurl/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('tokens');
    var urlToDelete = req.params.id;
    collection.remove({ '_id': urlToDelete }, function (err) {
        res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
        logdb("d", req, urlToDelete);
    });
});


module.exports = router;
