const net = require('net');
const config = require('./config');
const colors = require('colors');

var serverPort = config.serverPort;
var serverIp = config.serverIp;
var portsToTest = config.portsToTest;

function main(){
  if(!(process.argv.length != 4 | process.argv.length != 2)){
    console.log('usage: node socket_client ip port will read test port from input');
    console.log('------ node socket_client.js will read test ports from configuration');
    return;
  }
  var portsToTestFinal = [];
  if(process.argv.length == 4){
    serverIp = process.argv[2];
    portsToTestFinal = portsToTestFinal.concat(getPortsFromString(process.argv[3]));
  }
  if(process.argv.length == 2){
    for(var port of portsToTest){
      portsToTestFinal = portsToTestFinal.concat(getPortsFromString(port));
    }
  }
  connectServerPort(serverIp, serverPort, portsToTestFinal); 
}

/**
 * 
 * @param {*string} stringToConvert 
 */
function getPortsFromString(stringToConvert){
  var tmp;
  var start;
  var end;
  var ports = [];
  if(stringToConvert.includes('-')){
    tmp = stringToConvert.split('-');
    start = Number.parseInt(tmp[0]);
    end = Number.parseInt(tmp[1]);
  } else {
    start = Number.parseInt(stringToConvert);
    end = start + 1;
  }
  if(start > end){
      var foo = start;
      start = end;
      end = foo;
    }
  if(start > 65536){
    return ports;
  }
  if(isNaN(start) || isNaN(end)){
    return ports;
  }
  if(end > 65536){
    end = 65535;
  } 
  for(let i = start; i < end; i++){
    ports.push(i + '');
  }
  return ports;
}

function connectServerPort(ip, port, portsToTest){
  var client = new net.Socket();
  client.setTimeout(config.timeout);

  var counter = 0;
  client.connect(port, ip, () => {
    if(portsToTest.length > 0){
      client.write(portsToTest[0]);
    } else {
      console.log('Please make sure you have input correct port'.red);
      client.destroy();
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
    console.log('server port'.red);
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