const GenNick = require('../game/generateNicks');
const md5 = require('md5');

function User(id, idDB, token, nick, color, score = 0) {
    this.id = id;
    this.idDB = idDB;
    this.token = token;
    this.nick = nick;
    this.color = color;
    this.score = score;
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

    io.on('connection', socket => {
        console.log(`User connected into user manager ${socket.id}`);

        socket.on(SOCKET_EVENTS.LOGGED_IN, async token => {
            if (token) {
                const user = await db.getUserByToken(token);
                if (user) {
                    user.nickname = (user.nickname) ? user.nickname : genNick.genNick();
                    users.push(new User(socket.id, user.id, user.token, user.nickname, user.color));
                    socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 200 });
                    console.log(users);
                } else {
                    socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 100 });
                }
            } else {
                socket.emit(SOCKET_EVENTS.LOGGED_IN, { answer: 0 });
            }
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
            users.splice(users.indexOf(user, 1));
        });

    });

    function init() {
        mediator.subscribe(MEDIATOR_EVENTS.GET_USERS, () => { return users; });
        mediator.subscribe(MEDIATOR_EVENTS.CHANGE_USER_SCORE, changeScore);
    }
    init();
}

module.exports = UserManager;