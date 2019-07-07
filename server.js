const express = require('express')
const { route } = require('./routes/api')
const { Middleware } = require('./core/middleware')
const fs        = require('fs')
var bodyParser = require('body-parser');
const  fileUpload  = require('express-fileupload')
const { socket } = require('./socket')
const ejs       = require('ejs')
const path = require('path')
// const simpleWebRTC = require('simplewebrtc')
// const WebSocket = require('ws')
const http = require('http')
var Recaptcha = require('express-recaptcha').Recaptcha
var recaptcha = new Recaptcha('6LfPSnQUAAAAAAsFLMnSDHoiNOxUteCcO0HlLA4y','6LfPSnQUAAAAAHJ-zP2D6qwQ7vVhtZZzhXkButn8')
const app = express()
app.engine('html',ejs.renderFile)
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
const middleware = new Middleware()
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
// for parsing application/json
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
const io = require('socket.io').listen(server)
socket(io)
app.use('/api/mobile',require('./routes/mobile'))
app.use('/api',require('./routes/api'))
app.use('/',require('./routes/web'))
app.use('/assets',express.static(__dirname+'/views/assets'))
server.listen(4000,()=>{
    console.log("server run in 4000");
})

