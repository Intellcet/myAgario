function UserManager(options) {

    options = (options instanceof Object) ? options : {};

    const selectors = options.selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const socket = options.socket;
    const showPage = (options.showPage instanceof Function) ? options.showPage : () => {};
    const setScore = (options.setScore instanceof Function) ? options.setScore : () => {};
    const eventsUp = (options.eventsUp instanceof Function) ? options.eventsUp : () => {};

    let width;
    let height;

    socket.on(SOCKET_EVENTS.LOGIN, data => {
        if (data.answer === 200) {
            showPage('game');
            width = (selectors.canvasBlock.width() > selectors.canvasBlock.height()) ? selectors.canvasBlock.height() : selectors.canvasBlock.width();
            height = (selectors.canvasBlock.width() < selectors.canvasBlock.height()) ? selectors.canvasBlock.width() : selectors.canvasBlock.height();
            socket.emit(SOCKET_EVENTS.READY, { width, height });
            new GameManager({width, height, selectors, SOCKET_EVENTS, socket, setScore, showPage });
        }
    });

    socket.on(SOCKET_EVENTS.GAME_OVER, data => {
       if (data.answer === 200) {
           showPage('game over');
           selectors.loseString.empty();
           selectors.loseString.append(`Игрок ${data.data} погиб смертью труса! Ещё разок?`);
           eventsUp();
       }
    });


}