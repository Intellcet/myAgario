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

    function inviteToPartyHandler() {
        const buttons = $('.inviteToPartyBtn');
        buttons.off('click');
        buttons.on('click', function () {
            const idDB = $(this).data('val');
            if (idDB) {
                //socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, idDB);
            }
        });
    }

    socket.on(SOCKET_EVENTS.GAME_OVER, data => {
       if (data.answer === 200) {
           mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game over');
           $selectors.loseString.empty();
           $selectors.loseString.append(`Игрок ${data.data} погиб смертью труса! Ещё разок?`);
           mediator.call(MEDIATOR_EVENTS.EVENTS_UP);
       }
    });

    socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, users => {
        for (let user of users) {
            if (user.token !== token) {
                $selectors.playersList.append(`<div class="slider-item playersList-elem">
                        <p class="nickPlayer">${user.nick}</p>
                        <button class="inviteToPartyBtn" title="Пригласить в группу" data-val=${user.idDB}>+</button>
                    </div>`);
            } else {
                 $selectors.playersList.append(`<div class="slider-item playersList-elem">
                         <p class="nickPlayer">${user.nick}</p>
                     </div>`);
            }
        }
        inviteToPartyHandler();
    });

    socket.on(SOCKET_EVENTS.NEW_USER_CAME, user => {
        if (user.token !== token) {
            $selectors.playersList.append(`<div class="slider-item playersList-elem">
                        <p class="nickPlayer">${user.nick}</p>
                        <button class="inviteToPartyBtn" title="Пригласить в группу" data-val=${user.idDB}>+</button>
                    </div>`);
            inviteToPartyHandler();
        }
    });

    socket.on(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, data => {
        if (data.answer === 200) {
            //успешный инвайт
        } else {
            //неудачный инвайт
        }
    });

    //TODO::  Реализовать логику добавления в группу.

    socket.on(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, data => {
        //сообщение об инвайте
        //socket.emit(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY);
    });

    socket.on(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY, data => {
        //сообщение о результате инвайта
    });

    socket.on(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, data => {
        //сообщение об инвайте либеру группы
    });

    socket.on(SOCKET_EVENTS.NEW_USER_QUIT, id => {
       const buttons = $('.inviteToPartyBtn');
       for (let button of buttons) {
           let btn = $(button);
           if (btn.data('val') === id) {
               $(btn.parent()).remove();
           }
       }
    });

    socket.on(SOCKET_EVENTS.LOGGED_IN, data => {
        if (data.answer === 200) {
            socket.emit(SOCKET_EVENTS.READY, { width, height });
            socket.emit(SOCKET_EVENTS.GET_ONLINE_USERS);
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