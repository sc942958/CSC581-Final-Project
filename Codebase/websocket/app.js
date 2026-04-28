const WebSocket = require('ws');

// Create a WebSocket server on port 8000
//const wss = new WebSocket({ port: 8000 });
const wss = new WebSocket.Server({port: 8000});

console.log('WebSocket server is running on ws://localhost:8000');

const clients = new Map();
const games = new Map();
let waiting = [];

// Connection event handler
wss.on('connection', (ws) => {
  var canLogIn = true;
  let username;
  var game;
  let otherUsername;
  let test;
  let turn;
  let color;
  console.log('New client connected');
  
  // Send a welcome message to the client
  //ws.send(JSON.stringify({message:'Welcome to the WebSocket server!'}));

  // Message event handler
  ws.on('message', (message) => {
    json = JSON.parse(message);
    if(canLogIn && "login" in json){
      canLogIn = false;
      username = json.username;
      clients.set(username, ws);
      console.log(waiting.length);
      if(waiting.length > 0){
        otherUsername = waiting.shift();
        const theirSetupObject = {
          setup: true,
          username: username
        };
        const mySetupObject = {
          setup: true,
          username: otherUsername
        };
        clients.get(otherUsername).send(JSON.stringify(theirSetupObject));
        ws.send(JSON.stringify(mySetupObject));
      } else {
        waiting.push(username);
      }
    } else if("setup" in json){
      otherUsername = json.username;
      ws.send(JSON.stringify({message: "<b>Chat ready</b>"}));
    } else if("move" in json){
      //do stuff
    } else if("message" in json){
      if(otherUsername){
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(JSON.stringify({message:`<b>You:</b> ${json.message}`}));
        clients.get(otherUsername).send(JSON.stringify({message:`<b>${username}:</b> ${json.message}`}));
      }
    }
  });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(username);
  });
}); 