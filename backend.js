var express = require('express');
var multer  = require('multer');
var fs = require('fs');

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
    res.send({status:'good'});
});

app.get('/list',  function (req, res) {
    fs.readdir('./public/uploads', function(err,list){
        res.send(list);
    });
});

app.use('/', express.static(__dirname + '/public'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server Started!');
});