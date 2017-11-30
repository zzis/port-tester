const net = require('net');
const config = require('./config');
const colors = require('colors');

var serverPort = config.servicePort;

function main(){
  if(process.argv.length != 4){
    console.log('usage: node socket_client ip port');
    return;
  }
  var ip = process.argv[2];
  var portToTest = process.argv[3];
  connectServerPort(ip, serverPort, portToTest);
}

function connectServerPort(ip, port, portToTest){
  var client = new net.Socket();
  client.setTimeout(config.timeout);
  client.connect(port, ip, () => {
    client.write(portToTest);
  });
  client.on('data', (data) => {
    if(data.toString('utf8') == "established"){
      client.destroy();
      // for(var port of portsToTest){
        connectTestPort(ip, portToTest);
      // }
    } 
  });
  
  client.on('timeout', () => {
    console.log('port', port.red, 'on host', ip.yellow, 'connection timeout');
    client.destroy();
  });
  
  client.on('close', () => {
    // console.log('connection closed');
  });
  
  client.on('error', () => {
    console.log('port', port.red, 'on host', ip.yellow, 'connect falied');
    client.destroy();
  });
}

function connectTestPort(ip, port){
  var client = new net.Socket();
  client.setTimeout(config.timeout);
  client.connect(port, ip, () => {
    client.write('Test port');
  });
  client.on('data', (data) => {
    console.log('port ' + port.green, 'on host', ip.green, "connected");
    client.destroy();
  });
  
  client.on('timeout', () => {
    console.log('port', port.red, 'on host', ip.yellow, 'connection timeout');
    client.destroy();
  });
  
  client.on('close', () => {
    // console.log('connection closed');
  });
  
  client.on('error', () => {
    console.log('port', port.red, 'on host', ip.yellow, 'connect falied');
    client.destroy();
  });
}

main();