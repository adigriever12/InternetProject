var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    assert = require('assert'),
    mongo = require('./mongo.controller.js'),
    MongoClient = mongodb.MongoClient,
    url = 'mongodb://localhost:27017/ads';


// SCREENS
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

        db.collection('screens').find({}).toArray(function (err, docs) {
            assert.equal(err, null);

            //response.header('Access-Control-Allow-Origin', '*');
            var results = docs.map(function(curr) {
                return curr._id;
            });
            response.status(200);
            response.json(results);
        });
    });
}); // changed

app.get('/insertNewScreen', function(request, response) {
    var newScreenId = Number(request.query.id);

   mongo.insertNewScreen(newScreenId, function(res) {
       response.status(200);
       response.json(res);
   });
});

app.get('/deleteScreen', function(request, response) {
    var screenId = Number(request.query.id);

    mongo.deleteScreen(screenId, function(res) {
        response.status(200);
        response.json(res);
    });
});


// URL
app.get('/getAllUrlTemplates', function (request, response) {
    mongo.getAllURls(function (res) {
        response.status(200);
        response.json(res);
    });
}); // changed

app.get('/insertNewUrl', function(request, response) {
    var newUrlId = Number(request.query.id);

    mongo.insertNewUrl(newUrlId, function(res) {
        response.status(200);
        response.json(res);
    });
});

app.get('/deleteUrl', function(request, response) {
    var urlId = request.query.id;

    mongo.deleteUrl(urlId, function(res) {
        response.status(200);
        response.json(res);
    });
});


// Messages
app.post('/updateMessage', function (request, response) {
    var message = request.body.message;

    // fix dates from string to date objects
    message.timeFrame.forEach(function (curr, index) {
        message.timeFrame[index].fromDate = new Date(message.timeFrame[index].fromDate);
        message.timeFrame[index].toDate = new Date(message.timeFrame[index].toDate);
    });

    mongo.updateMessage(message, function (result) {
        response.status(200);
        response.json(result);
    });

});

app.post('/insertNewMessage', function (request, response) {
    var message = request.body.message;
    mongo.updateMongo(message, function (res) {
        response.status(200);
        response.json(res);
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

app.get('/getMessageById', function (request, response) {
    var id = request.query.id;

    mongo.getMessageById(id, function (res) {
        response.status(200);
        response.json(res);
    });
});


// Locations
app.get('/getScreensCity', function (request, response) {
    MongoClient.connect(url, function (err, db) {
        db.collection('screensHistory').group(['city'], {}, {"count": 0}, "function (obj, prev) { prev.count++; }",
            function (err, results) {
                response.header('Access-Control-Allow-Origin', '*');
                response.status(200);
                response.json(results);
            });
    });
});

app.get('/getLocations', function (request, response) {

    mongo.getLocations(function (res) {
        response.status(200);
        response.json(res);
    });

});


// FILTER
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


module.exports = app;