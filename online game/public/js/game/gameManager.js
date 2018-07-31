function GameManager(options) {

    options = (options instanceof Object) ? options : {};

    const width  = options.width  || 600;
    const height = options.height || 600;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const socket = options.socket;
    const setScore = (options.setScore instanceof Function) ? options.setScore : () => {};
    const showPage = (options.showPage instanceof Function) ? options.showPage : () => {};

    let player = true;
    const FILL_RECT_COLOR = '#00CED1';

    const graph = new Graph({ width, height });
    new Input({ canvas: graph.getCanvas(), socket, SOCKET_EVENTS });

    function render(scene) {
        const food = scene.food;
        const balls = scene.balls;
        graph.fillRect(FILL_RECT_COLOR);
        for (let _food of food) {
            graph.sprite(_food.img, {x: _food.center.x, y: _food.center.y}, _food.radius);
        }
        for (let ball of balls) {
            graph.circle({x: ball.center.x, y: ball.center.y}, ball.radius, ball.color);
            graph.printText(ball.nick, {x: ball.center.x, y: ball.center.y}, ball.radius);
        }
        graph.fillRender();
    }

    socket.on(SOCKET_EVENTS.UPDATE_SCENE, scene => {
        player = scene.find(ball => { return ball.id === socket.id });
        if (player) {
            render(player.scene);
            setScore(player.score);
        }
    });

    socket.on(SOCKET_EVENTS.PLAY_AGAIN, data => {
        if (data.answer === 200) {
            player = true;
            showPage('game');
        }
    });


}
