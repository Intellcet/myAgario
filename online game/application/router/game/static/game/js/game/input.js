function Input(options) {

    options = (options instanceof Object) ? options : {};

    const socket = options.socket;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const mediator = options.mediator;

    const canvas = mediator.call(MEDIATOR_EVENTS.GET_CANVAS);

    $(canvas).off('mousemove');
    $(canvas).on('mousemove', event =>{
        socket.emit(SOCKET_EVENTS.MOVEMENT, { dx: event.originalEvent.offsetX, dy: event.originalEvent.offsetY });
    });
}