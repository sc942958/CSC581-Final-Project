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
  console.log('New client connected');
  
  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Message event handler
  ws.on('message', (message) => {
    if(canLogIn){
      json = JSON.parse(message);
      ws.send(`Welcome, ${json.username}`);
      canLogIn = false;
      username = json.username;
      clients.set(username, ws);
      console.log(waiting.length);
      if(waiting.length > 0){
        otherUsername = waiting.shift();
      } else {
        waiting.push(username);
      }
    } else {
      console.log(`Received: ${message}`);
      // Echo the message back to the client
      ws.send(`You: ${message}`);
      clients.get(otherUsername).send(`${username}: ${message}`);
    }
  });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(username);
  });
}); 