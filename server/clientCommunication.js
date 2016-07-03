var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    mongo = require('./mongo.controller.js');

var clients = [];

io.on('connection', function(socket) {
    socket.emit('connected');
    socket.on('getData', function(data) {
        clients.push({socket:socket, location:data.location, screenId:data.screenId});
        updateScreensHistory(data.screenId, data.location, data.city);
        console.log(socket.id + ' is connected');
        mongo.queryMongo(Number(data.screenId), function (docs) {
            socket.emit('screensData', docs);
        });
    });

    socket.on('disconnect', function () {
        console.log(socket.id + ' is disconnected');

        // Delete socket from connected clients
        clients = clients.filter( function(item) {
            return (item.socket.id != socket.id);
        });
    });
});

var updateScreensHistory = function (screenId, location, city) {
    mongo.updateHistory(screenId, location, city, function (docs) {
        console.log('history updated');
    });
};

app.get('/screen=:id', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.get(/\.js|\.html|\.png/, function (request, response) {
    response.sendFile(__dirname + request.url);
});

app.get('/getConnectedScreens', function (request, response) {
    response.status(200);
    response.json(clients.length);
});

module.exports = app;