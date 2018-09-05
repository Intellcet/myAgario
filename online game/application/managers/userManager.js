const GenNick = require('../game/generateNicks');
const md5 = require('md5');

function User(id, idDB, token, nick, color, score = 0) {
    this.id = id;
    this.idDB = idDB;
    this.token = token;
    this.nick = nick;
    this.color = color;
    this.score = score;
    this.party = [];
}

function UserManager(options) {
    options = (options instanceof Object) ? options : {};
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const io = options.io;
    const mediator = options.mediator;
    const db = options.db;

    const genNick = new GenNick();
    const users = [];

    function changeScore (id) {
        const user = users.find(user => { return user.id === id; });
        if (user) {
            user.score++;
        }
    }

    function newUserQuit(user) {
        if (user) {
            io.local.emit(SOCKET_EVENTS.NEW_USER_QUIT, user.idDB);
        }
    }

    io.on('connection', socket => {
        console.log(`User connected to the user manager ${socket.id}`);

        socket.on(SOCKET_EVENTS.LOGGED_IN, async token => {
            if (token) {
                const user = await db.getUserByToken(token);
                if (user) {
                    user.nickname = (user.nickname) ? user.nickname : genNick.genNick();
                    const newUser = new User(socket.id, user.id, user.token, user.nickname, user.color);
                    users.push(newUser);
                    socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 200 });
                    socket.broadcast.emit(SOCKET_EVENTS.NEW_USER_CAME, newUser);
                    console.log(users);
                } else {
                    socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 100 });
                }
            } else {
                socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 0 });
            }
        });

        socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, () => {
            socket.emit(SOCKET_EVENTS.GET_ONLINE_USERS, users);
        });

        socket.on(SOCKET_EVENTS.DELETE_TOKEN, async token => {
            if (token) {
                const user = await db.getUserByToken(token);
                if (user) {
                    const res = await db.updateToken(user.id, null);
                    if (res) {
                        socket.emit(SOCKET_EVENTS.DELETE_TOKEN, { code: 200 });
                    } else {
                        socket.emit(SOCKET_EVENTS.DELETE_TOKEN, { code: 100 });
                    }
                }
            }
        });

        socket.on('disconnect', () => {
            const user = users.find(user => { return user.id === socket.id; });
            if (user) {
                newUserQuit(user);
                users.splice(users.indexOf(user), 1);
            }
        });

    });

    function init() {
        mediator.subscribe(MEDIATOR_EVENTS.GET_USERS, () => { return users; });
        mediator.subscribe(MEDIATOR_EVENTS.CHANGE_USER_SCORE, changeScore);
    }
    init();
}

module.exports = UserManager;