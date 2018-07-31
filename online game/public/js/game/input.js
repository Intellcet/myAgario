function Input(options) {

    options = (options instanceof Object) ? options : {};

    const canvas = options.canvas;
    const socket = options.socket;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;

    $(canvas).off('mousemove');
    $(canvas).on('mousemove', event =>{
        socket.emit(SOCKET_EVENTS.MOVEMENT, { dx: event.originalEvent.offsetX, dy: event.originalEvent.offsetY });
    });
}