const express = require('express')
const { route } = require('./routes/route')
const { Middleware } = require('./core/middleware')
const fs        = require('fs')
var bodyParser = require('body-parser');
const  fileUpload  = require('express-fileupload')
const { socket } = require('./socket')
// const simpleWebRTC = require('simplewebrtc')
// const WebSocket = require('ws')
const http = require('http')
const io = require('socket.io')(http)


var Recaptcha = require('express-recaptcha').Recaptcha

var recaptcha = new Recaptcha('6LfPSnQUAAAAAAsFLMnSDHoiNOxUteCcO0HlLA4y','6LfPSnQUAAAAAHJ-zP2D6qwQ7vVhtZZzhXkButn8')
const app = express()
const middleware = new Middleware()
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// for parsing application/json
app.use('/profile',express.static('../storage/profile'))
app.use(bodyParser.json({limit:'50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Headers","access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, _token");
    next();
});

// nodemailer

const server = http.createServer(app)


route(app,recaptcha,middleware)
socket(io);


server.listen(3000,()=>{
    console.log("server run");
})