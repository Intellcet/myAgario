const express = require('express');
const app = express();
const http = require('http').Server(app);
const Router = require('./application/router/router');
const io = require('socket.io')(http);
const Mediator = require('./application/mediator');
const DB = require('./application/db/db');
const GameManager = require('./application/managers/gameManager');
const UserManager = require('./application/managers/userManager');
const SETTINGS = require('./SETTINGS');

const db = new DB({ SETTINGS });
const router = new Router({ db });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/public`));
app.use('/game/static', express.static(`${__dirname}/application/router/game/static`)); // append game static
app.use(router);

const SOCKET_EVENTS = {
    LOGIN: 'USER LOGIN',
    READY: 'USER READY TO PLAY',
    UPDATE_SCENE: 'UPDATE SCENE',
    MOVEMENT: 'MOVEMENT OF THE BALL',
    GAME_OVER: 'GAME IS OVER',
    PLAY_AGAIN: 'PLAY AGAIN',
    LOGGED_IN: 'LOGGED IN',
    SHOW_GAME_RECORDS: 'show game records',
    SHOW_GLOBAL_RECORDS: 'show global records',
    DELETE_TOKEN: 'delete token',
    GET_ONLINE_USERS: 'get online users',
    NEW_USER_CAME: 'new user came',
    NEW_USER_QUIT: 'new user quit',
    SEND_INVITE_TO_PARTY: 'send invite to party',
    TAKE_INVITE_FOR_PARTY: 'take invite for party',
    ANSWER_ON_INVITE_TO_PARTY: 'answer on invite to party',
    TAKE_INVITE_FOR_PARTY_LEADER: 'take invite for party leader',
};

const MEDIATOR_EVENTS = {
    GET_USERS: 'get users',
    UPDATE_SCENE: 'update scene',
    GAME_OVER: 'game over',
    CHANGE_USER_SCORE: 'change user score',
};
const mediator = new Mediator({ MEDIATOR_EVENTS });
new UserManager({ io, SOCKET_EVENTS, MEDIATOR_EVENTS, mediator, db });
new GameManager({ io, SOCKET_EVENTS, MEDIATOR_EVENTS, mediator, db });

http.listen(3000, () => {
    console.log('The server has been started on port 3000');
});