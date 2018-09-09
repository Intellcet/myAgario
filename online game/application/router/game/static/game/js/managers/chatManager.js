function chatManager(options) {
    options = (options instanceof Object) ? options : {};
    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;
    const token = localStorage.getItem('token');

    $selectors.sendMessageBtn.off('click');

    $selectors.sendMessageBtn.on('click', () => {
        const message = $selectors.textMessage.val();
        if (message) {
            socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { message, token });
            $selectors.textMessage.val('');
        }
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, data => {
       if (data) {
           $selectors.sliderMessages.append(`<div class="mess"><strong>${data.nickname}: </strong><p class="messP">${data.message}</p></div>`);
       }
    });

    function init() {
        $selectors.sliderMessages.empty();
    }
    init();

}