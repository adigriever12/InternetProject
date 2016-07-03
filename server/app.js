var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    cors = require('cors'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    mongo = require('./mongo.controller.js'),
    //clientCommunication = require("./clientCommunication"),
    mongoRoutes = require("./mongo.routes"),
    Q = require("q");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, 'public')));

//app.use("/", clientCommunication);
app.use("/", mongoRoutes);

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

    socket.on('getUpdatedData', function(socketScreenId) {
        mongo.queryMongo(Number(socketScreenId), function (docs) {
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

var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

app.post('/upload', upload.single('file'), function(req, response) {

    mongo.insertNewUrl(req.file.filename, function(res) {
        response.status(200);
        response.json(res);
    });
});

server.listen(8080);
console.log('listening on port 8080');