const Game = require('../game/game');

function GameManager(options) {

    options = (options instanceof Object) ? options : {};

    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const io = options.io;
    const getUsers = (options.getUsers instanceof Function) ? options.getUsers : () => {};

    let users;

    function updateScene(scene) {
        io.local.emit(SOCKET_EVENTS.UPDATE_SCENE, scene);
    }

    function gameOver(player) {
        io.to(player.id).emit(SOCKET_EVENTS.GAME_OVER, { answer: 200, data: player.name });
    }

    let game = new Game({ updateScene, gameOver });

    io.on('connection', socket => {
        let user;
        let size;
        console.log(`User connected into game manager ${socket.id}`);

        socket.on(SOCKET_EVENTS.READY, _size => {
            users = getUsers();
            user = users.find(user => { return user.id === socket.id });
            if (user) {
                size = _size;
                game.start(user, size);
            }
        });

        socket.on(SOCKET_EVENTS.MOVEMENT, direction => {
            if (user) {
                game.direction(user.id, direction.dx, direction.dy);
            }
        });

        socket.on(SOCKET_EVENTS.PLAY_AGAIN, () => {
            users = getUsers();
            user = users.find(user => { return user.id === socket.id });
            if (user) {
                game.start(user, size);
            }
            socket.emit(SOCKET_EVENTS.PLAY_AGAIN, { answer: 200 });
        });

        socket.on('disconnect', () => {
            game.finish(socket.id);
        });

    });

}

module.exports = GameManager;