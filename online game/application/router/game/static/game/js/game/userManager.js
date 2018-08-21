function UserManager(options) {

    options = (options instanceof Object) ? options : {};

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;
    const storage = localStorage;
    let width;
    let height;

    const token = storage.getItem('token');

    socket.on(SOCKET_EVENTS.GAME_OVER, data => {
       if (data.answer === 200) {
           mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game over');
           $selectors.loseString.empty();
           $selectors.loseString.append(`Игрок ${data.data} погиб смертью труса! Ещё разок?`);
           mediator.call(MEDIATOR_EVENTS.EVENTS_UP);
       }
    });

    socket.on(SOCKET_EVENTS.LOGGED_IN, data => {
        if (data.answer === 200) {
            socket.emit(SOCKET_EVENTS.READY, { width, height });
            new GameManager({width, height, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator});
        }
    });

    function init() {
        if ($selectors.canvasBlock.width() > $selectors.canvasBlock.height()) {
            width = $selectors.canvasBlock.height();
            $selectors.canvasBlock.css('width', width);
        } else {
            width = $selectors.canvasBlock.height();
            $selectors.canvasBlock.css('width', width);
        }
        if ($selectors.canvasBlock.width() < $selectors.canvasBlock.height()) {
            height = $selectors.canvasBlock.width();
            $selectors.canvasBlock.css('height', height);
        } else {
            height = $selectors.canvasBlock.height();
            $selectors.canvasBlock.css('height', height);
        }
        socket.emit(SOCKET_EVENTS.LOGGED_IN, token);
    }
    init();

}