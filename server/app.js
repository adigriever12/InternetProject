var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    cors = require('cors'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    mongo = require('./mongo.controller.js'),
    clientCommunication = require("./clientCommunication").init(io),
    clientSocketApis = require("./clientCommunication").app,
    mongoRoutes = require("./mongo.routes"),
    uploadRoutes = require("./upload.routes");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, 'public')));

app.use("/", mongoRoutes);
app.use("/", uploadRoutes);
app.use("/", clientSocketApis);


app.get('/screen=:id', function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.get(/\.js|\.html|\.png/, function (request, response) {
    response.sendFile(__dirname + request.url);
});

server.listen(8080);
console.log('listening on port 8080');