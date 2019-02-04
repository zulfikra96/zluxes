const express = require('express')
const path = require('path')
const app = express()
const socket_server = require('../socket')
// const simpleWebRTC = require('simplewebrtc')
// const WebSocket = require('ws')
const http = require('http')
const socket = require('socket.io')

app.use('/assets',express.static('../assets'))
app.set('port',  8000);
// app.use('/assets',express.static('../assets'))
app.use('/libs/timepicker',express.static('../node_modules/timepicker.js'))

app.use('/views',express.static('../views'))

app.get('*',function(req,res){
    res.sendFile(path.resolve(__dirname + '/../views/index.html'))
})



const server = http.createServer(app).listen(app.get('port'),function(){

})


let io = socket.listen(server)

io.sockets.on('connection',function(socket){
    console.log("connection");
    socket_server.socket(socket,io)
})

