'use strict'

///////////////////////////////////////////////////////////////////
/////Example Chat Heroku Application using Heroku Bluzelle Add-on//
//////////////////////////////////////////////////////////////////

//including bodyParser to handle json requests
var bodyParser = require('body-parser')
//bluzelle api
var bluzelle = require('bluzelle');
//for spawning express server
var express = require('express');

//create the express server
var app = express();
//initiate http for socket.io
var http = require('http').Server(app);
//initiate socket
var io = require('socket.io')(http);

//set express configuration
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
//NOTE: port will only be assigned once deployed and executed on Heroku//
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
var port = process.env.PORT;

//initialize chat/db variables
var messagesChatRoom;
var valuePerKey;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
//NOTE: daemonUrl, daemonPort, and chatuuid will only be assigned once the Heroku Bluzelle Add-on //
// has been successfully attached to this deployed Heroku application.                           //
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
var daemonUrl = process.env.BLUZELLE_ADDRESS||'ws://testnet.bluzelle.com';
var daemonPort = process.env.BLUZELLE_PORT||'51010';
var chatuuid = process.env.BLUZELLE_UUID||'examplechatblz';

//create a connection to bluzelle (currently testnet)
bluzelle.connect(daemonUrl + ':'+ daemonPort,
  chatuuid);

//endpoint for grabbing all messages depending on the cr (chatroom) selected
app.put('/messages/:id', async (req, res) => {
  //array for messages per chat room
  var valueSet = []; 
  
  //retrieves all chatrooms available for the specified uuid (from the connection)
  let keysChatRoom = await bluzelle.keys();

  //loops through each chatrooms and stores its message history in an array
  for(var i = 0; i < keysChatRoom.length; i++){
    //only store the message history for the selected chatroom
    if(keysChatRoom[i].toString() == req.params.id){
      valuePerKey = await bluzelle.read(keysChatRoom[i]);
      valueSet[0] = valuePerKey;
    }
  }

  //take the message history array with the values and convert it to json
  messagesChatRoom = JSON.stringify(valueSet);
  //send the json response
  res.send(messagesChatRoom);
})

//endpoint for posting messages to the chat
app.post('/messages', async (req, res) => {
  try{
    //temporary array to organize insertion to db
    var chatHistoryPerUser = [];

    //get the message that was submitted via html form (message includes username and message)
    var message = req.body.message;
    //get the chatroom currently selected where messages are being submitted
    var keyName = req.body.keyChatRoom;

    //check if the chatroom exists in the uuid namespace
    const hasMyKey = await bluzelle.has(keyName);

    //check if chatroom exists, alter its existing message history in the database, otherwise, add a new message history
    //return internal server error if operations fail
    try{
      if(hasMyKey){

        //read current message history in the chatroom
        let currentMessage = await bluzelle.read(keyName);

        //parse the JSON response and place the message history into temporary array (in order)
        JSON.parse(currentMessage, (key, value) => {
          if (typeof value === 'string') {
            chatHistoryPerUser.push(value);
          }
          return value;
        });

        //add the newly submitted message to the temporary array AFTER current history messages
        chatHistoryPerUser.push(message.toString());
        //convert message array to json string
        message = JSON.stringify(chatHistoryPerUser);
        //update message value in db
        await bluzelle.update(keyName, message);
      }else{
        //place new message input to json object
        chatHistoryPerUser.push(message.toString());
        //convert message array to string
        message = JSON.stringify(chatHistoryPerUser)
        //create message value in db
        await bluzelle.create(keyName, message);
      }
    }
    catch(error){
      console.log('database commit failed: ' + error);
      res.sendStatus(500);
    }

    //notify if message saved in db
    console.log('saved');

    //send log via socket
    io.emit('message', req.body);

    //respond with success
    res.sendStatus(200);
  }
  catch (error){
    //send internal error response
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    //confirm on success message
    console.log('Message Posted')
  }

})

//user connect to the socket
io.on('connection', () =>{
  console.log('a user is connected')
})

//server listening
var server = http.listen(port, () => {
  console.log('server is running on port', server.address().port);
});
