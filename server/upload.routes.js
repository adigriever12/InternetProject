var express = require('express'),
    app = express(),
    mongo = require('./mongo.controller.js'),
    multer = require('multer');


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

app.post('/upload', upload.single('file'), function (req, response) {
    // insert new urls to DB
    mongo.insertNewUrl(req.file.filename, function (res) {
        response.status(200);
        response.json(res);
    });
});

app.post('/uploadPics', upload.single('file'), function (req, response) {
    response.status(200);
    var isTrue = req != undefined;
    response.json(isTrue);
});

module.exports = app;