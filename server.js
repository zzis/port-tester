const net = require('net');
const config = require('./config');
const colors = require('colors');

var serverPort = config.serverPort;

function start(){
  var server = net.createServer((socket) => {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.on('data', (data) => {
      // console.log("remote connected" + socket.name);
      // console.log(data.toString('utf8'));
      portToTest = data.toString('utf8');
      socket.write("established");
      listenTestPort(portToTest); 
    });
  });
  server.listen(serverPort, () => {
    console.log('Listening on', serverPort);
  });
  server.on('error', e => {
    if(e.code === 'EADDRINNUSE'){
      console.log('Port', serverPort, 'already in use, please change a port');
    }
    throw e;
  });
}

function listenTestPort(port){
  var server = net.createServer((socket) => {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.on('data', (data) => {
      // console.log("remote connected" + socket.name);
      console.log('remote', socket.name,'port', port.green, 'connected');
      socket.write("port" + socket.localPort + " connected");
      socket.destroy();
      server.close();
    });
  }).listen(port);
  server.on('error', (err) => {
    console.log(err);
    server.close();
    throw err;
  });
}

start();