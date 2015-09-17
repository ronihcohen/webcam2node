var express = require('express');
var multer  = require('multer');
//var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://tardis.uk.to:27017/test';
var collName = 'self-chat-1';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

var upload = multer({ storage: storage });
var app = express();

app.post('/capture', upload.single('file'), function (req, res, next) {

    var postObj = {'file': req.file.filename, 'msg':req.body.msg};

        MongoClient.connect(dbUrl,  function(err, db){
            if(err) throw err;
            var collection = db.collection(collName);
            collection.insert(postObj, function(err, docs)  {
                    console.log(docs);
                if (err){
                    console.log('BAD');
                }
            });
        });

    res.send({status:'good'});
});

app.get('/list',  function (req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        var collection = db.collection(collName);
        collection.find().toArray(function(err, results) {
            res.send(results);
        });
    });

    //fs.readdir('./public/uploads', function(err,list){
    //    res.send(list);
    //});
});

app.use('/', express.static(__dirname + '/public'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server Started!');
});