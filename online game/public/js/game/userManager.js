function UserManager(options) {

    options = (options instanceof Object) ? options : {};

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;

    let width;
    let height;

    socket.on(SOCKET_EVENTS.LOGIN, data => {
        if (data.answer === 200) {
            mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game');
            width = ($selectors.canvasBlock.width() > $selectors.canvasBlock.height()) ? $selectors.canvasBlock.height() : $selectors.canvasBlock.width();
            height = ($selectors.canvasBlock.width() < $selectors.canvasBlock.height()) ? $selectors.canvasBlock.width() : $selectors.canvasBlock.height();
            socket.emit(SOCKET_EVENTS.READY, { width, height });
            new GameManager({width, height, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator});
        }
    });

    socket.on(SOCKET_EVENTS.GAME_OVER, data => {
       if (data.answer === 200) {
           mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game over');
           $selectors.loseString.empty();
           $selectors.loseString.append(`Игрок ${data.data} погиб смертью труса! Ещё разок?`);
           mediator.call(MEDIATOR_EVENTS.EVENTS_UP);
       }
    });


}