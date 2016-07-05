var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    mongo = require('./mongo.controller.js');

var clients = [];

app.get('/getConnectedScreens', function (request, response) {
    response.status(200);
    response.json(clients.length);
});

// Messages
app.post('/insertNewMessage', function (request, response) {
    var message = request.body.message;

    // fix dates from string to date objects
    message.timeFrame.forEach(function (curr, index) {
        message.timeFrame[index].fromDate = new Date(message.timeFrame[index].fromDate);
        message.timeFrame[index].toDate = new Date(message.timeFrame[index].toDate);
    });

    mongo.updateMongo(message, function (res) {
        updateClients();
        response.status(200);
        response.json(res);
    });
});

app.post('/updateMessage', function (request, response) {
    var message = request.body.message;

    // fix dates from string to date objects
    message.timeFrame.forEach(function (curr, index) {
        message.timeFrame[index].fromDate = new Date(message.timeFrame[index].fromDate);
        message.timeFrame[index].toDate = new Date(message.timeFrame[index].toDate);
    });

    mongo.updateMessage(message, function (result) {
        updateClients();
        response.status(200);
        response.json(result);
    });

});

app.post('/deleteMessageById', function (request, response) {
    var id = request.body.id;

    mongo.deleteMessageById(id, function (res) {
        updateClients();
        response.status(200);
        response.json(res);
    });
});

var updateClients = function () {
    clients.forEach(function (currClient) {
        mongo.queryMongo(Number(currClient.screenId), function (docs) {
            currClient.socket.emit('screensData', docs);
        });
    });
};


// Screens
app.get('/deleteScreen', function (request, response) {
    var screenId = Number(request.query.id);

    mongo.deleteScreen(screenId, function (res) {
        clients.forEach(function (currClient) {
            if (screenId == Number(currClient.screenId)) {
                currClient.socket.emit('screensData', []);
            }
        });
        response.status(200);
        response.json(res);
    });
});


var updateScreensHistory = function (screenId, location, city) {
    mongo.updateHistory(screenId, location, city, function (docs) {
        console.log('history updated');
    });
};

var init = function(io){
    io.on('connection', function (socket) {
        socket.emit('connected');
        socket.on('getData', function (data) {
            clients.push({socket: socket, location: data.location, screenId: data.screenId});
            updateScreensHistory(data.screenId, data.location, data.city);
            console.log(socket.id + ' is connected');
            mongo.queryMongo(Number(data.screenId), function (docs) {
                socket.emit('screensData', docs);
            });
        });

        socket.on('getUpdatedData', function (socketScreenId) {
            mongo.queryMongo(Number(socketScreenId), function (docs) {
                socket.emit('screensData', docs);
            });
        });

        socket.on('disconnect', function () {
            console.log(socket.id + ' is disconnected');

            // Delete socket from connected clients
            clients = clients.filter(function (item) {
                return (item.socket.id != socket.id);
            });
        });
    });
};

module.exports = {
    init: init,
    app: app
};


