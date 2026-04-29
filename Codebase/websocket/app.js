const WebSocket = require('ws');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
  let otherUsername;
  let myTurn;
  let myColor;
  let theirColor;
  let gameID;
  let stacks;
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
        gameID = Math.floor(Math.random()*1000000);
        gameBoard = [
          ["","","","","","",""],
          ["","","","","","",""],
          ["","","","","","",""],
          ["","","","","","",""],
          ["","","","","","",""],
          ["","","","","","",""]
        ];
        games.set(gameID, gameBoard);
        const mySetupObject = {
          setup: true,
          username: otherUsername,
          turn: false,
          color: ""
        };
        const theirSetupObject = {
          setup: true,
          username: username,
          gameID: gameID,
          turn: false,
          color: ""
        };
        const num = Math.floor(Math.random()*2);
        if(num == 1){
          mySetupObject.turn=true;
          mySetupObject.color="yellow";
          theirSetupObject.color="red"
        } else {
          mySetupObject.color="red";
          theirSetupObject.color="yellow";
          theirSetupObject.turn=true;
        }
        clients.get(otherUsername).send(JSON.stringify(theirSetupObject));
        ws.send(JSON.stringify(mySetupObject));
      } else {
        waiting.push(username);
      }
    } else if("setup" in json){
      otherUsername = json.username;
      gameID = json.gameID;
      myTurn = json.turn;
      color = json.color;
      if(color == "red"){
        theirColor="yellow"
      } else theirColor="red";
      stacks = [5,5,5,5,5,5,5];
      ws.send(JSON.stringify({message: "<b>Chat ready</b>"}));
    } else if("myMove" in json){
      myMove(json.move);
    } else if("theirMove" in json){
      theirMove(json.move);
    } else if("message" in json){
      if(otherUsername){
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(JSON.stringify({message:`<b>You:</b> ${DOMPurify.sanitize(json.message)}`}));
        clients.get(otherUsername).send(JSON.stringify({message:`<b>${username}:</b> ${DOMPurify.sanitize(json.message)}`}));
      }
    }
  });

  const myMove = function(col){
    clients.get(otherUsername).send(JSON.stringify({move: col}));
    drop(games.get(gameID), col, myColor);
  }

  const theirMove = function(col){
    ws.send(JSON.stringify({move: col}));
    drop(games.get(gameID), col, theirColor);
  }

  const drop = function(game, column, color){
    let row;
    if(stacks[column] > 0){
      game[stacks[column]][column] = color;
      row = stacks[column];
      stacks[column--];
    }
    let num = 0;
    let i = 1;
    let switchdirection = false;
    //checking horizontal connection
    while(true){
      if(game[stacks[column]][column-i] == color && !switchdirection){
        num++;
        i++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {switchdirection = true;}
      if(game[stacks[column]][column+i] == color && switchdirection){
        num++;
        i++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {
        num = 0;
        i = 1;
        switchdirection = false;
        break;
      };
    }
    //checking vertical connection
    while(true){
      if(game[stacks[column]-i][column] == color && !switchdirection){
        num++;
        i++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {switchdirection = true;}
      if(game[stacks[column]+1][column] == color && switchdirection){
        num++;
        i++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {
        num = 0;
        i = 1;
        switchdirection = false;
        break;
      };
    }
    //checking downward slant
    while(true){
      if(game[stacks[column]-i][column-i] == color && !switchdirection){
        num++;
        inc++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {switchdirection = true;}
      if(game[stacks[column]+i][column+i] == color && switchdirection){
        num++;
        inc++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {
        num = 0;
        inc = 1;
        switchdirection = false;
        break;
      };
    }
    //checking upward slant
    while(true){
      if(game[stacks[column]+i][column-i] == color && !switchdirection){
        num++;
        inc++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {switchdirection = true;}
      if(game[stacks[column]-i][column+i] == color && switchdirection){
        num++;
        inc++;
        if(num == 4 && color == myColor){
          iWin();
        } else theyWin();
      } else {
        num = 0;
        inc = 1;
        switchdirection = false;
        break;
      };
    }
  }

  const iWin = function(){
    ws.send(JSON.stringify({gameEnd: "iwin"}));
  }

  const theyWin = function(){
    ws.send(JSON.stringify({gameEnd: "theywin"}));
  }

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(username);
  });
}); 