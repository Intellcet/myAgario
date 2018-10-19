function ChatManager(options) {
    options = (options instanceof Object) ? options : {};
    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;
    const token = localStorage.getItem('token');

    $selectors.sendMessageBtn.off('click').on('click', () => {
        const message = $selectors.textMessage.val();
        if (message) {
            const indicate = $selectors.commonChat.hasClass("selected-chat") ? "global" : "party";
            socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { message, token, indicate });
            $selectors.textMessage.val('');
        }
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, data => {
        console.log(data);
        if (data) {
           switch (data.indicate) {
               case "global":
                   if ($selectors.commonChat.hasClass("selected-chat")) {
                       $selectors.sliderMessages.append(`<div class="mess"><strong>${data.nickname}: </strong><p class="messP">${data.message}</p></div>`);
                   }
               break;
               /*case "party":
                   if ($selectors.partyChat.hasClass("selected-chat")) {
                       $selectors.sliderMessages.append(`<div class="mess"><strong>${data.nickname}: </strong><p class="messP party-mess">${data.message}</p></div>`);
                   }
               break;*/
           }
       }
    });

    function init() {
        $selectors.sliderMessages.empty();
    }
    init();

}