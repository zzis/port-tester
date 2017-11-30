const net = require('net');
const config = require('./config');
const colors = require('colors');

var serverPort = config.serverPort;
var serverIp = config.serverIp;
var portsToTest = config.portsToTest;

function main(){
  if(process.argv.length == 4){
    serverIp = process.argv[2];
    portsToTest = [process.argv[3]];
  //  console.log('usage: node socket_client ip port');
  }
  connectServerPort(serverIp, serverPort, portsToTest); 
}

function connectServerPort(ip, port, portsToTest){
  var client = new net.Socket();
  client.setTimeout(config.timeout);

  var counter = 0;
  client.connect(port, ip, () => {
    if(portsToTest.length > 0){
      client.write(portsToTest[0]);
    }
  });
  client.on('data', (data) => {
    if(data.toString('utf8') == "established"){
      connectTestPort(ip, portsToTest[counter]).then(() => {
        counter++;
        if(counter < portsToTest.length){
          client.write(portsToTest[counter]);
        } else {
          client.destroy();
        }
      });
    } 
  });
  
  client.on('timeout', () => {
    console.log('port', port.red, 'on host', ip.yellow, 'connection timeout');
    client.destroy();
  });
  
  client.on('close', () => {
    // console.log('connection closed');
  });
  
  client.on('error', (err) => {
    console.log(colors.red.underline('Connect server port error', err.message));
    console.log('port', colors.red(port), 'on host', ip.yellow, 'connect falied');
    client.destroy();
  });
}

function connectTestPort(ip, port){
  return new Promise((resolve, reject) => {
    var client = new net.Socket();
    client.setTimeout(config.timeout);
    client.connect(port, ip, () => {
      client.write('Test port');
    });
    client.on('data', (data) => {
      console.log('port ' + port.green, 'on host', ip.green, "connected");
      client.destroy();
      resolve();
    });
    
    client.on('timeout', () => {
      console.log('port', port.red, 'on host', ip.yellow, 'connection timeout');
      client.destroy();
      resolve();
    });
    
    client.on('close', () => {
      // console.log('connection closed');
    });
    
    client.on('error', () => {
      console.log('port', port.red, 'on host', ip.yellow, 'connect falied');
      client.destroy();
    });
  });
}

main();