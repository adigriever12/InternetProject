var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    assert = require('assert'),
    mongo = require('./mongo.controller.js'),
    MongoClient = mongodb.MongoClient,
    url = 'mongodb://localhost:27017/ads',
    cors = require('cors'),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, 'public')));

var clients = [];

io.on('connection', function(socket) {
    clients.push(socket);
    console.log(socket.id + ' is connected');

    socket.emit('connected');
    socket.on('getData', function(data) {
        mongo.queryMongo(Number(data.screenId), function (docs) {
            socket.emit('screensData', docs);
        });
    });
	
	socket.on('disconnect', function () {
		console.log(socket.id + ' is disconnected');
		
		// Delete socket fro, connected clients
		clients = clients.filter( function(item) {
			return (item.id != socket.id);
			});
  });
});

var listenToConnections = function (screenId, fromDate, toDate, day, fromTime, toTime) {
    io.sockets.on('connection', function (client) {

        clients.push(client);

        mongo.queryMongo(screenId, function (docs) {
            client.emit('screensData', docs);
        }, fromDate, toDate, day, fromTime, toTime);

        console.log(client.id + ' is connected');
    });
};
var updateScreensHistory = function(screenId) {
	
	MongoClient.connect(url, function (err, db) {

	assert.equal(null, err);

	db.collection('screensHistory').insert({id:screenId, date:new Date()});
	db.close();
	});
};
app.get(/\.js|\.html|\.png/, function (request, response) {
    response.sendFile(__dirname + request.url);
});

app.get('/screen=:id', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");

    var screenId = Number(request.params.id);
	updateScreensHistory(screenId);
	
    /*mongo.queryMongo(screenId, function (docs) {
        client.emit('screensData', docs);
    });

    console.log(client.id + ' is connected');

    listenToConnections(screenId);*/
});

app.get('/TestUpdate', function (request, response) {
    var id = Number(request.query.id);

    mongo.updateMongo(
        {
            "name": "update",
            "texts": ["new new !! a new message is here"],
            "pictures": ["dolphin.jpg"],
            "url": "c.html",
            "length": "2",
            "timeFrame": [
                {
                    fromDate: new Date("January 1, 2016 00:00:00 GMT"),
                    toDate: new Date("December 31, 2016 00:00:00 GMT"),
                    "days": [
                        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                    ],
                    "fromTime": "00:01",
                    "toTime": "23:55"
                }
            ],
            "frames": [
                id
            ]
        });

    mongo.queryMongo(id, function (docs) {

        clients.forEach(function (currClient) {
            currClient.emit('screensData', docs);
        });
    });

    response.status(200);
    response.json("updated successfully");

});

app.post('/getScreensIdsByConditions', function (request, response) {
    var screenIds = request.body.ids.map(function (id) {
        return Number(id);
    });
    var fromDate = new Date(request.body.fromDate);
    var toDate = new Date(request.body.toDate);
    var days = request.body.days;
    var fromTime = request.body.fromTime;
    var toTime = request.body.toTime;

    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        mongo.findFramesForAd(db, screenIds, fromDate, toDate, days, fromTime, toTime, function (docs) {
            db.close();

            var frames = [];
            docs.forEach(function (curr) {

                curr.frames.forEach(function (frame) {
                    if (frames.indexOf(frame) == -1) {
                        frames.push(frame);
                    }
                });
            });

            response.header('Access-Control-Allow-Origin', '*');
            response.status(200);
            response.json(frames);
        });
    });
});

app.get('/getAllScreensIds', function (request, response) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('messages').find({}).toArray(function (err, docs) {
            assert.equal(err, null);

            var frames = [];
            docs.forEach(function (curr) {

                curr.frames.forEach(function (frame) {
                    if (frames.indexOf(frame) == -1) {
                        frames.push(frame);
                    }
                });
            });

            response.header('Access-Control-Allow-Origin', '*');
            response.status(200);
            response.json(frames);
        });
    });
});

app.get('/getAllMessages', function (request, response) {

    mongo.getAllMessages(function (res) {
        response.status(200);
        response.json(res);
    });
});

app.post('/deleteMessageById', function (request, response) {
    var id = request.body.id;

    mongo.deleteMessageById(id, function (res) {
        response.status(200);
        response.json(res);
    });
});

app.get('/getMessageById', function(request, response) {
   var id = request.query.id;

    mongo.getMessageById(id, function (res) {
        response.status(200);
        response.json(res);
    });
});

server.listen(8080);
console.log('listening on port 8080');