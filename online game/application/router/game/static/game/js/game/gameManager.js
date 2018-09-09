function GameManager(options) {

    options = (options instanceof Object) ? options : {};

    const width  = options.width  || 600;
    const height = options.height || 600;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;

    let player = true;

    function render(scene) {
        const food = scene.food;
        const balls = scene.balls;
        mediator.call(MEDIATOR_EVENTS.FILL_RECT);
        for (let _food of food) {
            mediator.call(MEDIATOR_EVENTS.SPRITE, { img: _food.img, koord: {x: _food.center.x, y: _food.center.y}, radius: _food.radius });
        }
        for (let ball of balls) {
            mediator.call(MEDIATOR_EVENTS.CIRCLE, { koord: {x: ball.center.x, y: ball.center.y}, r: ball.radius, color: ball.color });
            mediator.call(MEDIATOR_EVENTS.PRINT_TEXT, { text: ball.nick, koord: {x: ball.center.x, y: ball.center.y}, r: ball.radius });
        }
        mediator.call(MEDIATOR_EVENTS.FILL_RENDER);
    }

    socket.on(SOCKET_EVENTS.UPDATE_SCENE, scene => {
        player = scene.find(ball => { return ball.id === socket.id });
        if (player) {
            render(player.scene);
            mediator.call(MEDIATOR_EVENTS.SET_SCORE, player.score);
        }
    });

    socket.on(SOCKET_EVENTS.PLAY_AGAIN, data => {
        if (data.answer === 200) {
            player = true;
            mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game');
        }
    });

    function init() {
        mediator.call(MEDIATOR_EVENTS.SHOW_GAME_RECORDS);
        mediator.call(MEDIATOR_EVENTS.SHOW_GLOBAL_RECORDS);
        new Graph({ MEDIATOR_EVENTS, mediator, width, height });
        new Input({ socket, SOCKET_EVENTS, MEDIATOR_EVENTS, mediator });
    }

    init();
}
