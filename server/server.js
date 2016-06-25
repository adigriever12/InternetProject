var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/ads';
var assert = require('assert');
var sql = require('mssql');

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var clients = [];

var listenToConnections = function(screenId,fromDate, toDate,day, fromTime, toTime) {
	io.sockets.on('connection', function(client) {

		clients.push(client);

		if (!fromDate) {
			var now = new Date();
			fromDate = now;
			toDate = now;
			day = weekday[now.getDay()];
			var nowTime = now.getHours() + ":" + now.getMinutes();
			fromTime = nowTime;
			toTime = nowTime;
		}

		queryMongo(screenId,fromDate, toDate,day,fromTime,toTime, function(docs) {
			client.emit('screensData', docs);
		});

		console.log(client + ' is connected');
	});
};

var config = {
	server: '12.0.2000',
	database: 'MSSQLLocalDB',
	stream: true
};

sql.connect(config, function(err) {
	// ... error checks

	var request = new sql.Request();
	request.stream = true; // You can set streaming differently for each request
	request.query('select * from verylargetable'); // or request.execute(procedure);

	request.on('recordset', function(columns) {
		// Emitted once for each recordset in a query
	});

	request.on('row', function(row) {
		// Emitted for each row in a recordset
	});

	request.on('error', function(err) {
		// May be emitted multiple times
	});

	request.on('done', function(affected) {
		// Always emitted as the last one
	});
});

sql.on('error', function(err) {
	// ... error handler
});

app.get('/screens', function(request, response) {
	MongoClient.connect(url, function (err, db) {

		assert.equal(null, err);

		db.collection('messages').find({}).toArray(function(err, docs) {
			assert.equal(err, null);

			var frames = [];
			docs.forEach(function(curr) {

				curr.frames.forEach(function(frame) {
					if (frames.indexOf(frame) == -1) {
						frames.push(frame);
					}
				});
			});

			response.header('Access-Control-Allow-Origin' , '*' );
			response.status(200);
			response.json(frames);
		});
	});
});

var queryMongo = function(screenId,fromDate, toDate,day, fromTime, toTime, callback) {

	MongoClient.connect(url, function (err, db) {

		assert.equal(null, err);

		findFramesForAd(db, screenId,fromDate, toDate,day, fromTime, toTime, function (docs) {
			db.close();
			callback(docs);
		});
	});
};

var findFramesForAd = function(db, screenId, fromDate, toDate,day, fromTime, toTime, callback) {
	//var now = new Date();
	//var day = weekday[now.getDay()];
	//var nowTime = now.getHours() + ":" + now.getMinutes();

	db.collection('messages').find( {
		frames: { $in: [screenId] },
		timeFrame: { $elemMatch: {
			fromDate: {$lt: fromDate},
			toDate: {$gt: toDate},
			days: {$in: [day]},
			fromTime: {$lt: fromTime},
			toTime: {$gt: toTime} }
		}
	}).toArray(function(err, docs) {
		assert.equal(err, null);
		callback(docs);
	});
};

var updateMongo = function(newMesseage) {
	MongoClient.connect(url, function (err, db) {

		assert.equal(null, err);

		db.collection('messages').insert(newMesseage);
		db.close();
	});
};

app.get('/TestUpdate', function(request, response) {
	var id = request.query.id;

	updateMongo(
		{
			"name" : "update",
			"texts" : "4",
			"pictures" : "2",
			"url" : "a.html",
			"length" : "2",
			"timeFrame" : [
				{
					fromDate: new Date("January 1, 2016 00:00:00 GMT"),
					toDate: new Date("December 31, 2016 00:00:00 GMT"),
					"days" : [
						"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
					],
					"fromTime" : "00:01",
					"toTime" : "23:55"
				}
			],
			"frames" : [
				id
			]
		});

	queryMongo(id, function(docs) {

		clients.forEach(function(currClient) {
			currClient.emit('screensData', docs);
		});
	});

	response.status(200);
	response.json("updated successfully");

});

app.get(/\.js|\.html|\.png/, function(request, response) {
	response.sendFile(__dirname + request.url);
});

app.get('/screen=:id', function(request, response) {
	response.sendFile(__dirname + "/index.html");

	var screenId = Number(request.params.id);

	listenToConnections(screenId);
});

app.get('/getScreens', function(request, response) {
	var screenIds = request.query.ids.map(function(id) {
        return Number(id);
    });
	var fromDate = new Date(request.query.fromDate);
	var toDate = new Date(request.query.toDate);
	var days = request.query.days;
	var fromTime = request.query.fromTime;
	var toTime = request.query.toTime;

    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        findFramesForAd(db, screenIds,fromDate, toDate,days, fromTime, toTime, function (docs) {
            db.close();

            var frames = [];
            docs.forEach(function(curr) {

                curr.frames.forEach(function(frame) {
                    if (frames.indexOf(frame) == -1) {
                        frames.push(frame);
                    }
                });
            });

            response.header('Access-Control-Allow-Origin', '*' );
            response.status(200);
            response.json(frames);
        });
    });
});


server.listen(8080);
console.log('listening on port 8080');

var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";