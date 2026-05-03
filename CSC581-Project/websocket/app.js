const WebSocket = require('ws');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Create a WebSocket server on port 8000
//const wss = new WebSocket({ port: 8000 });
const wss = new WebSocket.Server({port: 8000});

console.log('WebSocket server is running on port 8000');

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
  let inGame = false;
  console.log('New client connected');
  
  // Send a welcome message to the client
  //ws.send(JSON.stringify({message:'Welcome to the WebSocket server!'}));

  // Message event handler
  ws.on('message', (message) => {
    json = JSON.parse(message);
    if(canLogIn && "login" in json){
      login(json);
    } else if("setup" in json){
      setup(json);
      ingame = true;
    } else if("myMove" in json){
      myMove(json.myMove);
    } else if("theirMove" in json){
      theirMove(json.theirMove);
    } else if("loss" in json){
      iLose();
    } else if("disconnect" in json){
      iWin();
    } else if("message" in json){
      if(otherUsername){
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(JSON.stringify({message:`<b>You:</b> ${DOMPurify.sanitize(json.message)}`}));
        clients.get(otherUsername).send(JSON.stringify({message:`<b>${username}:</b> ${DOMPurify.sanitize(json.message)}`}));
      }
    }
  });

  const login = function(json){
    canLogIn = false;
    username = json.username;
    clients.set(username, ws);
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
      rows = [5,5,5,5,5,5,5];
      const game = {
        gameBoard: gameBoard,
        rows: rows,
        moves: 0
      }
      games.set(gameID, game);
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
      inGame = true;
    } else {
      waiting.push(username);
    }
  }

  const setup = function(json){
    otherUsername = json.username;
    if("gameID" in json) gameID = json.gameID;
    myTurn = json.turn;
    myColor = json.color;
    if(myColor == "red"){
      theirColor="yellow"
    } else theirColor="red";
    ws.send(JSON.stringify({message: "<b>Chat ready</b>"}));
  }
    
  const myMove = function(col){
    clients.get(otherUsername).send(JSON.stringify({move: col}));
    drop(col);
  }
  
  const theirMove = function(col){
    ws.send(JSON.stringify({move: col}));
  }

  const drop = function(column){
      game = games.get(gameID);
      game.gameBoard[game.rows[column]][column] = myColor;
      //horizontal
      checkDirection(game, column, 1, 0)
      
      //vertical
      ||checkDirection(game, column, 0, 1)
      
      //downward slope
      ||checkDirection(game, column, 1, 1)
      
      //upward slope
      ||checkDirection(game, column, -1, 1);
      game.rows[column]--;
      game.moves++;
      if(game.moves == 42) draw();
  }

  const checkDirection = function(game, column, x, y){
    let incx = x;
    let incy = y;
    let num = 1;
    let switchdirection = false;
    let nextRow;
    let nextColumn;
    while(true){
      //nextRow < 6 && nextRow > -1
      const verifyRow = (game.rows[column] + incy < 6) && (game.rows[column] + incy > -1);
      //nextColumn < 7 && nextColumn > -1
      const verifyColumn = (column+incx < 7) && (column+incx > -1);
      let verified = true;
      if((verifyRow && verifyColumn)){  
        nextRow = game.rows[column] + incy;
        nextColumn = column+incx;
      } else {
        verified = false;
      }

      if(verified && game.gameBoard[nextRow][nextColumn] == myColor){
        num++;
        if(num >= 4){
          iWin();
          inGame = false;
          return true;
        }
        if(!switchdirection){
          incy += y;
          incx += x;
        } else {
          incy -= y;
          incx -= x;
        }
      } else {
        if(!switchdirection) {
          switchdirection = true;
          incx = -x;
          incy = -y;
        }
        else return false;
      }
    }
  }
  
  const iWin = function(){
    ws.send(JSON.stringify({gameEnd: "win"}));
    if(inGame) clients.get(otherUsername).send(JSON.stringify({gameEnd: "loss"}));
    games.delete(gameID);
    var canLogIn = true;
    username = undefined;
    otherUsername = undefined;
    myTurn = undefined;
    myColor = undefined;
    theirColor = undefined;
    gameID = undefined;
  }

  const iLose = function(){
    //ws.send(JSON.stringify({gameEnd: "loss"}));
    var canLogIn = true;
    username = undefined;
    otherUsername = undefined;
    myTurn = undefined;
    myColor = undefined;
    theirColor = undefined;
    gameID = undefined;
  }

  const draw = function(){
    ws.send(JSON.stringify({gameEnd: "draw"}));
    clients.get(otherUsername).send(JSON.stringify({gameEnd: "draw"}));
  }
  
  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(username);
    const user = waiting.indexOf(username);
    waiting = waiting.slice(user,user);
    if(inGame){
      clients.get(otherUsername).send(JSON.stringify({disconnect: true}));
    }
  });
}); 

// const testBoard = [
//   [".",".",".",".",".",".","."],
//   [".",".",".",".",".",".","."],
//   [".",".",".",".",".",".","."],
//   [".",".",".",".",".",".","."],
//   [".",".",".",".",".",".","."],
//   [".",".",".",".",".",".","."]
//   ]
// testBoard[nextRow][nextColumn] = "#";
// testBoard[game.rows[column]][column] = "C";
// console.log(JSON.stringify(testBoard[0]));
// console.log(JSON.stringify(testBoard[1]));
// console.log(JSON.stringify(testBoard[2]));
// console.log(JSON.stringify(testBoard[3]));
// console.log(JSON.stringify(testBoard[4]));
// console.log(JSON.stringify(testBoard[5])+"\n");