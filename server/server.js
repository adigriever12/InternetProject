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

var listenToConnections = function (screenId, fromDate, toDate, day, fromTime, toTime) {
    io.sockets.on('connection', function (client) {

        clients.push(client);

        mongo.queryMongo(screenId, function (docs) {
            client.emit('screensData', docs);
        }, fromDate, toDate, day, fromTime, toTime);

        console.log(client.id + ' is connected');
    });
};
var updateScreensHistory = function(screenId, location, city) {
	mongo.updateHistory(screenId, location, city, function (docs) {
        console.log('history updated');
    });
    };
app.get(/\.js|\.html|\.png/, function (request, response) {
    response.sendFile(__dirname + request.url);
});

app.get('/screen=:id', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");

    var screenId = Number(request.params.id);
	//updateScreensHistory(screenId);
	
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
    var date = new Date(request.body.date);
    var days = request.body.days;
    var time = request.body.time;

    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        mongo.findFramesForAd(db, screenIds, date, date, days, time, time, function (docs) {
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

app.get('/getLocations', function (request, response) {

    mongo.getLocations(function(res) {
        response.status(200);
        response.json(res);
    });

});
app.get('/getConnectedScreens', function (request, response) {
    response.status(200);
    response.json(clients.length);
});

app.get('/getAllUrlTemplates', function (request, response) {
    mongo.getAllURls(function (res) {
        response.status(200);
        response.json(res);
    });
});

app.post('/updateMessage', function (request, response) {
    var message = request.body.message;

    // fix dates from string to date objects
    message.timeFrame.forEach(function(curr, index) {
        message.timeFrame[index].fromDate = new Date(message.timeFrame[index].fromDate);
        message.timeFrame[index].toDate = new Date(message.timeFrame[index].toDate);
    });

    mongo.updateMessage(message, function(result) {
        response.status(200);
        response.json(result);
    });

});

app.post('/insertNewMessage', function (request, response) {
    var message = request.body.message;
    mongo.updateMongo(message, function(res) {
        response.status(200);
        response.json(res);
    });
});

app.get('/getScreensCity', function (request, response) {
    MongoClient.connect(url, function (err, db) {
        db.collection('screensHistory').group(['city'], {}, {"count":0}, "function (obj, prev) { prev.count++; }",
            function(err, results) {
                response.header('Access-Control-Allow-Origin', '*');
                response.status(200);
                response.json(results);
            });
    });
});

app.get('/getFilterValues=:filter', function (request, response) {
    var filter = request.params.filter;

    MongoClient.connect(url, function (err, db) {
        db.collection('messages').group([filter], {}, {"count":0}, "function (obj, prev) { prev.count++; }",
            function(err, results) {
                response.header('Access-Control-Allow-Origin', '*');
                response.status(200);
                response.json(results);
            });
    });
});

app.post('/historyFilterValuesGet', function (request, response) {
    var group = request.body.group;
    
    MongoClient.connect(url, function (err, db) {
        db.collection('screensHistory').aggregate(
            [
                group
            ]
        ).toArray(function (err, docs) {
            response.header('Access-Control-Allow-Origin', '*');
            response.status(200);
            response.json(docs);

        });
    });
});

app.post('/filteredMessages', function (request, response) {
    var findQuery = request.body.find;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('messages').find(findQuery).toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();
            response.header('Access-Control-Allow-Origin', '*');
            response.status(200);
            response.json(docs);
        });
    });
});

app.post('/filteredData', function (request, response) {
    var findQuery = request.body.find;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('screensHistory').find(findQuery).toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();
            response.header('Access-Control-Allow-Origin', '*');
            response.status(200);
            response.json(docs);
        });
    });
});


server.listen(8080);
console.log('listening on port 8080');