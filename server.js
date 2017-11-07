const net = require('net');
const config = require('./config');

var serverPort = config.servicePort;

function start(){
  net.createServer((socket) => {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.on('data', (data) => {
      console.log("remote connected" + socket.name);
      portToTest = data.toString('utf8');
      listen(portToTest);
      socket.write("established");
    })
  }).listen(serverPort);
}

function listen(port){
  var server = net.createServer((socket) => {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.on('data', (data) => {
      console.log("remote connected" + socket.name);
      console.log(data.toString('utf8'));
      socket.write("port" + socket.localPort + " connected");
      socket.destroy();
    })
  }).listen(port);
  server.on('error', (err) => {
    console.log(err);
  })
}

start();