var express = require('express');
var router = express.Router();

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}


function getIp(req)  {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //console.log('\n getting addresses')
    //console.log(req.headers['x-forwarded-for']);
    //console.log(req.connection.remoteAddress);
    //console.log(req.ip);
    return ip;
}

function logdb(req, url) {

    var db = req.db;
    var date = Date();
    var ip = getIp(req);
    var collection = db.get('logs');
    collection.insert(
       {
           "url": url,
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


function savedb(req, token, url ) {

   var db = req.db;
   var date= Date();
   var ip = getIp(req);
   var collection = db.get('tokens');
   collection.insert(
      {"token" : token,
       "url" : url,
       "date" : date,
       "ip" : ip},
      function (err, doc) {
        if (err) {
          return false;   // no error
        } else {
          return true;   // error inserting
        }
      });
}


/* Return url */
function returnURL ( req, token, url) {
  // build url
  var results = {};
  var newurl = req.protocol + '://' + req.get('host') + '/g/' + token;
  if (savedb(req,token,url))  {
      results["error"] = 'cannot insert';
  } else {
        results["url"] = newurl;
        results["error"] = '';
    }
  return results;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'surl' });
});

/* GET home page. */
router.get('/list', function(req, res, next) {
  res.render('list', { title: 'Help' });
});



/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/*  GET url list  */
router.get('/g/:token', function(req, res) {
var db = req.db;
var collection = db.get('tokens');
//var token = req.query.t;  // $_GET["t"]
var token = req.params.token;

collection.find({'token': token},{ 'token': 1, 'url': 1},function(e,docs){
    if (docs[0]) {
      var myurl = docs[0].url;
      var mytoken = docs[0].token;
     
      logdb(req, myurl);
      res.redirect(myurl);
    }
    else {
      res.redirect("/");
    }
  });
});

/* add new record via a form */
router.get('/new', function(req,res) {
  res.render('new', {title: 'Add new url'});
});

/* POST add mew url logic (from query string) */
router.get('/s', function(req, res) {
   var token= req.query.t;
   if (!token) {
      token = randomString(8,'A#');
   }
   var url= req.query.url;
   res.json(returnURL(req,token,url));
});
/* POST add mew url logic (from form) */
router.post('/newurl', function(req, res) {

   var token= req.body.token;
   if (!token) {
      token = randomString(5,'A#');
   }
   var url=req.body.url;
  res.json(returnURL(req,token,url));
});


module.exports = router;
