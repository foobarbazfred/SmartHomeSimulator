//------------------------------------------------------------------
//
// Smart Home Simualtor(1.0.7)
// file:app.js
//  
// 1.0.0   first  version
// 1.0.1   fix bug (miss find local ip)  2024/1/2
// 1.0.2   change listen port 8085 -> 8010  2024/1/10
// 1.0.3   2024/01/21 change connection status:  offline -> online 
// 1.0.4   2024/01/21 modify get_properties (change to reply all properties)
// 1.0.5   2024/01/25 modify get_property (change json format)
// 1.0.6   2024/02/18 modify device id for common  e.g. 00000  or 012345
// 1.0.7   2024/03/01 Changed device ID to general ID  (e.g. 012345)
// 1.0.8   2024/06/05 Changed device ID to general ID  (e.g. 012345FF)
// 1.0.9   2024/12/07 support option (--ip,  --port)
//
//------------------------------------------------------------------
// https://socket.io/get-started/chat

const os = require('os');
const express = require('express');    // npm install express
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');    // npm install socket.io
const io = new Server(server);

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


// setting for parse body of HTTP POST
const bodyParser = require('body-parser')  // npm install body-parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// set ejs to view engine
const ejs = require('ejs');         // install ejs

const DEFAULT_PORT = 8010;          // listen port  changed 8085 -> 8010 (v1.0.2)

// Handle string option arguments
const argv = yargs(hideBin(process.argv))
  .option('port', {
    type: 'string',
    description: 'port number',
  })
  .option('ip', {
   type: 'string',
   description: 'ip address',
 })
 .help()
 .argv;

if ( argv.ip != undefined ){
   listen_ip = argv.ip;
}else{
    listen_ip =  get_local_ip();       // get server side ip
}
if ( argv.port != undefined ){
   listen_port = argv.port;
}else{
   listen_port = DEFAULT_PORT;
}


app.use('/js', express.static(__dirname + '/public/js'));
app.use('/js/img', express.static(__dirname + '/public/img'));

const fs = require('fs');
const HOMEPAGE_TEMPLATE  = fs.readFileSync('./templates/index.ejs', 'utf-8');

let req_resp = [];
let client_id = null;

//----------------------------------------
//
// response for Web Page  (ELWebAPI Support Page)
//
//----------------------------------------
app.get('/', (req, res) => {

   let client_connection = '';
   console.log('get /');

   // check connection server<---->IoT Home Simulator
   if(client_id === null){
          client_connection = 'not connected';
   }else{
          client_connection = 'connected';
   }
   // rendering HTML
   const data = ejs.render(HOMEPAGE_TEMPLATE,
       {connection_status: client_connection,
        server_status: 'ok',
        ip_address: `${listen_ip}:${listen_port}`
   });
   res.send(data);

});

//----------------------------------------
//
// response for IoT House Simulator
//
//----------------------------------------
app.get('/iothouse', (req,res) => {

   console.log('get /iothouse');   
   res.sendFile(__dirname + '/public/iothouse.html');

});


//---------------------------------------
//
//   ECHONET Lite Web API (ELWebAPI)
//
//---------------------------------------
app.get('/elapi', (req, res) => {

   console.log('get /elapi');   

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_api_versions';
   args = '';
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');

});

app.get('/elapi/v1', (req, res) => {

   console.log('get /elapi/v1');   

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_v1_descriptions';
   args = '';
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');
});

app.get('/elapi/v1/devices', (req, res) => {

   console.log('get /elapi/v1');   

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_devices';
   args = '';
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');
});


//
// Get Device Description
// e.g.
//   http://localhost:8085/elapi/v1/devices/<device_id>
//

app.get('/elapi/v1/devices/:device_id', (req, res) => {

   const device_id = req.params.device_id;
   console.log('get /elapi/v1/devices/<device_id>');
   console.log(`id:${device_id}`);

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_description';
   args = {device_id : device_id };
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');

});



//
// Get Properties of Device
// e.g.
//   http://localhost:8085/elapi/v1/devices/<device_id>/properties
//
app.get('/elapi/v1/devices/:device_id/properties', (req, res) => {

   const device_id = req.params.device_id;
   console.log('get /elapi/v1/devices/<device_id>/properties');
   console.log(`id:${device_id}`);

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_properties';
   args = {device_id : device_id };
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');

});



// Get Property of Device
// e.g
//   http://localhost:8085/elapi/v1/devices/<device_id>/properties/operationStatus
//
app.get('/elapi/v1/devices/:device_id/properties/:property_name', (req, res) => {

   const device_id = req.params.device_id;
   const property_name = req.params.property_name;
   console.log('get /elapi/v1/devices/<device_id>/properties/<property_name>');
   console.log(`id:${device_id}, propname:${property_name}`);

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }
   const procedure = 'get_property_value';
   args = {device_id : device_id , property_name: property_name };
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');

});



// PUT
// e.g
//   http://localhost:8085/elapi/v1/devices/<device_id>/properties/operationStatus
//
app.put('/elapi/v1/devices/:device_id/properties/:property_name', (req, res) => {
   const device_id = req.params.device_id;
   const property_name = req.params.property_name;
   const property_value = req.body[property_name];

   console.log('set /elapi/v1/devices/<device_id>/properties/<property_name>');
   console.log(`id:${device_id}, propname:${property_name}`);
   console.log(`value:${property_value}`);

   // check connection to Emulator
   if(client_id === null){
        res.send('Error!! IoT House Simulator is not connected');
        return;
   }

   const procedure = 'set_property_value';
   args = {device_id : device_id , property_name: property_name  , property_value: property_value };
   request_id = 111;
   msg = {'procedure_name' : procedure, 'args' : args , 'request_id' : request_id}
   // send message to Kaden Emulator w/websocket
   io.emit('request', JSON.stringify(msg));
   receive_and_response(res);
   console.log('aft timeout');
});





//
// wait response from IoT Home Simulator and 
//     send response to API Caller (Human or Application)
//
async function receive_and_response(res){

   for(let retry=0; retry<30; retry++){  // retry 30times -> max wait 3000msec
      console.log(`enter mywait ${retry}/30`);  
      // wait for 100msec w/sync
      await new Promise(resolve => setTimeout(resolve, 100));  // timeout:100msec
      console.log('end of wait');  

      // check number of data from Emulator
      if (req_resp.length > 1){  
         console.log('internal Error');  
         console.log('too many return value in buffer!!');  
         console.log('you must re-design server/client communication method');  
      }
      if (req_resp.length >= 1){
	   console.log('i ll send response');  
           const report = req_resp.pop()
           console.log(report);
           const body = JSON.stringify(report.value);
           res.set({'content-type' : 'application/json; charset=utf-8'});
           res.send(body);
           return true;
       }
   }
   res.send('Error!! no response from [IoT Home Simulator]');
   return true;
}



//---------------------------------------
//
//
//   directional communicating 
//
//       Server <---ws---> IoT Home Simulator
//
//    by WebSocket
//
//   https://blog.honjala.net/entry/2018/08/08/022027
//
//---------------------------------------
io.on('connection', (socket) => {

   console.log('connection');
   client_id = socket.id;

   socket.on('hello', (msg) => {
        console.log('hello from client');
        console.log(msg);
        io.emit('ack','received');
   });

   socket.on('response', (msg) => {
        console.log('----response from client--------------------------------------');
        console.log(msg);
        req_resp.push(JSON.parse(msg));
        io.emit('ack','received');
   });
});

server.listen(listen_port, listen_ip, () => {
   console.log(`listen on ${listen_ip}:${listen_port}`);
});


function get_local_ip(){

   let ip_addr = null;
   let find_flag = false;
   const info = os.networkInterfaces();
   for (let key of Object.keys(info)){
       if(key === 'lo'){   // skip loopback
           continue;
       }
       //console.log(key);
       for (let obj of info[key]){
           //console.log(obj);
           //console.log(obj.family);
           //if (obj.family === 'IPv4') {
            //    console.log("this is IPv4");
           //}else{
            //    console.log("this is not IPv4");
           //}
           if (obj.family === 'IPv4') {
                ip_addr = obj.address;
                if(ip_addr === '127.0.0.1'){
                        continue;
                }else{
                   console.log("this is IPv4 and IP is detected");
                   console.log(ip_addr);
                   find_flag = true;
                   break;  // that is
                }
           }
      }
      if (find_flag == true) {
           break;
      }else{
           console.log("Error! can not detect IP");
      }
   }
  return ip_addr

}


//https://weseek.co.jp/tech/1484/
