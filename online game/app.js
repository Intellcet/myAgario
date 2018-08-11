const express = require('express');
const app = express();
const http = require('http').Server(app);
const Router = require('./application/router/router');
const io = require('socket.io')(http);
const Mediator = require('./application/mediator');
const GameManager = require('./application/managers/gameManager');
const UserManager = require('./application/managers/userManager');

const router = new Router();
app.use(express.static(`${__dirname}/public`));
app.use(router);

const SOCKET_EVENTS = {
    LOGIN: 'USER LOGIN',
    READY: 'USER READY TO PLAY',
    UPDATE_SCENE: 'UPDATE SCENE',
    MOVEMENT: 'MOVEMENT OF THE BALL',
    GAME_OVER: 'GAME IS OVER',
    PLAY_AGAIN: 'PLAY AGAIN',
};

const MEDIATOR_EVENTS = {
    GET_USERS: 'get users',
};

const mediator = new Mediator({ MEDIATOR_EVENTS });
new UserManager({ io, SOCKET_EVENTS, MEDIATOR_EVENTS, mediator });
new GameManager({ io, SOCKET_EVENTS, MEDIATOR_EVENTS, mediator });

http.listen(3000, () => {
    console.log('Server ran on port 3000');
});