# CSC581-Final-Project: Online Connect 4
<img width="1040" height="500" alt="Blank diagram(4)" src="https://github.com/user-attachments/assets/500d1fcf-efe0-4d2f-995d-7346028b696d" />

##Overview
My Project is a multiplayer online Connect 4 game. The application allows 2 players to play a game of Connect 4 online, with the server being able to host more than 1 match at a time. Users can create accounts that store their wins, losses and draws, and those stats are updated on the home page after every game. The application runs on three containers: a nodejs container that serves the frontend files and connects to the database, a mongo image with the schema applied from the frontend server, and a second nodejs container that runs a websocket server which enables users to actually play the game. The project was constructed to be containerized from the beginning, so its structure was defined by a three container layout.

###Database Container

The database service runs off of the base mongo image, which simplifies the process of using a database because I didn't need to start up a mongo server. I chose mongo for the project because of its ease of use with nodejs with the mongoose module, and the convenience of the official image. The database only needed one schema, that being the user account. The web server communicates with the database over the default private docker compose network, using a url with the required port for the database. The game server does not connect to the database.

###Frontend Container

The web-server service is built off of the base official nodejs image, with all of the necessary file added during the build process. I chose node because the use of express made routing easy. The server is organized in the Model View Controller framework. The web server handles every feature of the application other than connecting the users to each other, and hosting the actual database. It serves three main pages: A login screen, an account creation screen, and the home screen, which is where the game is played and shows the users stats. 

When a new user creates an account, the registration page sends a request to the server with the new username and password, which is routed to the registration controller. The controller queries the database to see if there is already a user with the reqested username, and return a 409 status if a conflict exists. If the username is not taken, the controller uses the User model to save the new account into the database container. When the user attempts to log in, the web server receives a request with the username and password, and checks them with a database query. If the password is correct, the user gets a cookie which is required to pass the authentication middleware that runs before the home page. 

The home page displays three main elements. A div for the game on the left, a chatbox in the middle with a turn indicator above it, and a stats display on the right. When the user is not in a game, the div contains a "look for game" button, and the turn indicator states that the user is not in a game. 

When the page is first loaded, the front end javascript sends a post request to the web server with the players username. This request is routed to "/stats", which is not covered by the authentication middleware because the stats controller runs its own authentication based on the users cookie before sending back their stats. On a successful query, the stats are then displayed on the right. Every time a game ends, the javascript queries the database with an update that increments the appropriate stat for a win, loss, or draw. A majority of the javascript is devoted to running the actual game by communicating with the game server.

###Web Socket Container

The game-server service is built off of the base official nodejs image, 
