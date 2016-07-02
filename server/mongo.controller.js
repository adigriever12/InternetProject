var mongodb = require('mongodb'),
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    MongoClient = mongodb.MongoClient,
    url = 'mongodb://localhost:27017/ads';

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

var updateMongo = function (newMesseage, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(false);
        } else {
            db.collection('messages').insert(newMesseage);
            db.close();
            callback(true);
        }
    });
};


var findFramesForAd = function (db, screenId, fromDate, toDate, day, fromTime, toTime, callback) {
    db.collection('messages').find({
        frames: {$in: screenId},
        timeFrame: {
            $elemMatch: {
                fromDate: {$lte: new Date(fromDate)},
                toDate: {$gte: new Date(toDate)},
                days: {$in: day},
                fromTime: {$lte: fromTime},
                toTime: {$gte: toTime}
            }
        }
    }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var getAllMessages = function (callback) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('messages').find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();
            callback(docs);
        });
    });
};

var deleteMessageById = function (id, callback) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);
        db.collection('messages').deleteOne({"_id": new ObjectID(id)}, function (err, res) {
            db.close();
            if (res.deletedCount > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
};

var getMessageById = function(id, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        
        db.collection('messages').find({"_id": new ObjectID(id)}).toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();
            callback(docs);
        });
    });
};

var updateHistory = function(screenId, location, city, callback) {

    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('screensHistory').insert({id:screenId, date:new Date(), location:location, city:city});
        db.close();
        callback(true);
    });
};
var getLocations = function(callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('screensHistory').find().toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();
            callback(docs);
        });
    });
};

var getAllURls = function(callback) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('messages').find({}, {url: 1, _id:0 }).toArray(function (err, docs) {
            assert.equal(err, null);
            db.close();

            var urls = [];
            docs.forEach(function(curr) {
               if (urls.indexOf(curr.url) == -1) {
                   urls.push(curr.url);
               }
            });
            callback(urls);
        });
    });
};

var updateMessage = function(message, callback) {
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);

        db.collection('messages').update({_id: new ObjectID(message.id)}, message, function (err, docs) {
            if (err || docs.result.nModified != 1) {
                callback(false);
            }
            db.close();

            callback(true);
        });
    });
};

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

module.exports = {
    queryMongo: queryMongo,
    updateMongo: updateMongo,
    findFramesForAd: findFramesForAd,
    getAllMessages: getAllMessages,
    deleteMessageById: deleteMessageById,
    getMessageById: getMessageById,
    updateHistory: updateHistory,
    getLocations: getLocations,
    getAllURls: getAllURls,
    updateMessage: updateMessage
};
