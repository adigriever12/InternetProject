var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/ads';

var queryMongo = function (screenId, callback, fromDate, toDate, day, fromTime, toTime) {

    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        if (!fromDate) {
            var now = new Date();
            fromDate = now;
            toDate = now;
            day = [weekday[now.getDay()]];
            var nowTime = now.getHours() + ":" + now.getMinutes();
            fromTime = nowTime;
            toTime = nowTime;
        }

        findFramesForAd(db, [screenId], fromDate, toDate, day, fromTime, toTime, function (docs) {
            db.close();
            callback(docs);
        });
    });
};

var updateMongo = function (newMesseage) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('messages').insert(newMesseage);
        db.close();
    });
};


var findFramesForAd = function (db, screenId, fromDate, toDate, day, fromTime, toTime, callback) {
    //var now = new Date();
    //var day = weekday[now.getDay()];
    //var nowTime = now.getHours() + ":" + now.getMinutes();

    db.collection('messages').find({
        frames: {$in: screenId},
        timeFrame: {
            $elemMatch: {
                fromDate: {$lt: fromDate},
                toDate: {$gt: toDate},
                days: {$in: day},
                fromTime: {$lt: fromTime},
                toTime: {$gt: toTime}
            }
        }
    }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

module.exports = {
    queryMongo: queryMongo,
    updateMongo: updateMongo,
    findFramesForAd: findFramesForAd
};
