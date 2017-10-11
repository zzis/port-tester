# Port Tester

The tester is to test only tcp connection to a server's specific port to see if the port is available or fire wall is opened for the port.

## Usage

Before you run the tester, please make sure there is at least one port opened to establish the communication between server & client, and please change the port at socket_client.js, socket_server.js.


You need copy the project to both server & client sides  
As for client side, run command `.\node socket_client.js server-ip port-to-test`  
As for server side, just run `.\node socket_server.js`  
