const Game = require('../game/game');

function GameManager(options) {

    options = (options instanceof Object) ? options : {};

    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const io = options.io;
    const mediator = options.mediator;
    const db = options.db;

    let users;

    function updateScene(scene) {
        io.local.emit(SOCKET_EVENTS.UPDATE_SCENE, scene);
    }

    function gameOver(player) {
        io.to(player.id).emit(SOCKET_EVENTS.GAME_OVER, { answer: 200, data: player.name });
    }

    let game = new Game({ mediator, MEDIATOR_EVENTS, db });

    io.on('connection', socket => {
        let user;
        let size;

        socket.on(SOCKET_EVENTS.READY, _size => {
            users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
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
            users = mediator.call(MEDIATOR_EVENTS.GET_USERS);
            user = users.find(user => { return user.id === socket.id });
            if (user) {
                user.score = 0;
                game.start(user, size);
            }
            socket.emit(SOCKET_EVENTS.PLAY_AGAIN, { answer: 200 });
        });

        socket.on(SOCKET_EVENTS.SHOW_GAME_RECORDS, () => {
            socket.emit(SOCKET_EVENTS.SHOW_GAME_RECORDS, mediator.call(MEDIATOR_EVENTS.GET_USERS));
        });

        socket.on(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS, async () => {
            socket.emit(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS, await db.getRecords());
        });

        socket.on('disconnect', () => {
            game.finish(socket.id);
        });

    });

    function init() {
        mediator.subscribe(MEDIATOR_EVENTS.UPDATE_SCENE, updateScene);
        mediator.subscribe(MEDIATOR_EVENTS.GAME_OVER, gameOver);
    }

    init();

}

module.exports = GameManager;