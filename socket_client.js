const net = require('net')

var serverPort = 30000

if(process.argv.length != 4){
  console.log('usage: node socket_client ip port')
  return
}

var ip = process.argv[2]
var portToTest = process.argv[3]

testConnection(ip, serverPort)

function testConnection(ip, port){
  var client = new net.Socket()

  client.setTimeout(3000)
  client.connect(port, ip, () => {
    client.write(portToTest)
  })
  client.on('data', (data) => {
    if(data.toString('utf8') == "established"){
      testConnection(ip, portToTest)
      client.destroy()
    } else {
      console.log('port ' + port + " connected")
      client.destroy()
    }
  })
  
  client.on('timeout', () => {
    console.log('port', port, 'on host', ip, 'connect falied')
    client.destroy()
  })
  
  client.on('close', () => {
    console.log('connection closed')
  })
  
  client.on('error', () => {
    console.log('port', port, 'on host', ip, 'connect falied')
    client.destroy()
  })
}
