//Game Board
startPane = document.querySelector('#startButton');
const stacks = [5,5,5,5,5,5,5];
var color = "red"
startButton = document.querySelector('#startButton');
var playerName;

const startGame = async function(){
    const ws = new WebSocket('ws://localhost:8000');

    console.log(playerName);

    ws.addEventListener('open', (event) => {
      const setupObject = {
        username: playerName
      };
      ws.send(JSON.stringify(setupObject));
    });

    const messages = document.querySelector('#messages');

    ws.onmessage = (event) => {
      const message = document.createElement('div');
      message.className = 'message';
      message.textContent = event.data;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    };

    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        ws.send(message);
        messageInput.value = '';
      }
    }

    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    console.log("Start button pressed");
    startPane.style.display = "none";
    document.querySelector('#board').style.display = "grid";
    document.querySelector('#col1').style.display = "grid";
    document.querySelector('#col2').style.display = "grid";
    document.querySelector('#col3').style.display = "grid";
    document.querySelector('#col4').style.display = "grid";
    document.querySelector('#col5').style.display = "grid";
    document.querySelector('#col6').style.display = "grid";
    document.querySelector('#col7').style.display = "grid";


    col1 = document.querySelector("#col1")
    col2 = document.querySelector("#col2")
    col3 = document.querySelector("#col3")
    col4 = document.querySelector("#col4")
    col5 = document.querySelector("#col5")
    col6 = document.querySelector("#col6")
    col7 = document.querySelector("#col7")

    col1.addEventListener("click", function(){drop(col1, 0)});
    col2.addEventListener("click", function(){drop(col2, 1)});
    col3.addEventListener("click", function(){drop(col3, 2)});
    col4.addEventListener("click", function(){drop(col4, 3)});
    col5.addEventListener("click", function(){drop(col5, 4)});
    col6.addEventListener("click", function(){drop(col6, 5)});
    col7.addEventListener("click", function(){drop(col7, 6)});
}

const drop = function(col, num){
    if(stacks[num] > -1){
        col.children[stacks[num]].style.backgroundColor = color;
    }
    stacks[num]--;
    if(color == "red") color = "yellow"; else color = "red";
} 

startButton.addEventListener("click", function(){startGame()});



//Stats
const loadStats = async function() {
   try{     
        response = await fetch('/stats', {
            method: "post"
        });
        player = await response.json();
        playerName = player.username;
        stats = document.querySelector("#stats");
        stats.appendChild(document.createTextNode(player.username));
        stats.appendChild(document.createTextNode(`Wins: ${player.wins}`));
        stats.appendChild(document.createTextNode(`Losses: ${player.losses}`));
        stats.appendChild(document.createTextNode(`Draws: ${player.draws}`));
        
    }catch(error){
    console.log(error);
   }
}
loadStats();