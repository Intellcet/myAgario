const GenNick = require('../game/generateNicks');

function User(id, nick, color, score = 0) {
    this.id = id;
    this.nick = nick;
    this.color = color;
    this.score = score;
}

function UserManager(options) {
    options = (options instanceof Object) ? options : {};
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const io = options.io;

    const genNick = new GenNick();
    const users = [];

    io.on('connection', socket => {
        console.log(`User connected into user manager ${socket.id}`);

        socket.on(SOCKET_EVENTS.LOGIN, data => {
            data.nick = (data.nick) ? data.nick : genNick.genNick();
            users.push(new User(socket.id, data.nick, data.color));
            socket.emit(SOCKET_EVENTS.LOGIN, { answer: 200 });
            console.log(users);
        });

        socket.on('disconnect', () => {
            users.splice(users.indexOf(users.find(user => { return user.id === socket.id; })), 1);
        });

    });

    this.getUsers = () => { return users; };
}

module.exports = UserManager;