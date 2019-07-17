function UserManager(options) {

    options = (options instanceof Object) ? options : {};

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;
    const storage = localStorage;

    let inParty = false;
    let width;
    let height;

    const token = storage.getItem('token');
    let onlineUsers = [];

    //leave party button and back to online players list button
    function buttonsHandlerUp() {
        /*inParty = !inParty;
        $selectors.playersOnlineStr.empty();
        $selectors.playersOnlineStr.append('Игроков в группе: <button class="exitFromPartyBtn">х</button>'+
            '<button class="returnBtn">Назад</button>');
        const $returnBtn = $('.returnBtn');
        const $exitFromPartyBtn = $('.exitFromPartyBtn');
        $returnBtn.off('click').on('click', () => {
            if (inParty) {
                $selectors.party.hide();
            } else {
                $selectors.party.show();
            }
            inParty = !inParty;
        });
        $exitFromPartyBtn.off('click').on('click', () => {
            $returnBtn.off('click');
            $exitFromPartyBtn.off();
            $selectors.party.hide();
            inParty = false;
            $selectors.playersOnlineStr.empty();
            $selectors.playersOnlineStr.append('Игроков в сети: ');
            socket.emit(SOCKET_EVENTS.LEAVE_FROM_PARTY, token);
        });*/
    }

    function inviteToPartyHandler() {
        const buttons = $('.inviteToPartyBtn');
        buttons.off('click');
        buttons.on('click', function () {
            const idDB = $(this).data('val');
            if (idDB) {
                socket.emit(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, idDB);
            }
        });
    }

    socket.on(SOCKET_EVENTS.GAME_OVER, data => {
       if (data.answer === 200) {
           mediator.call(MEDIATOR_EVENTS.SHOW_PAGE, 'game over');
           $selectors.loseString.empty();
           $selectors.loseString.append(`Игрок ${data.data} погиб! Ещё разок?`);
           mediator.call(MEDIATOR_EVENTS.EVENTS_UP);
       }
    });

    socket.on(SOCKET_EVENTS.CHANGE_USER, () => {
        socket.emit(SOCKET_EVENTS.GET_ONLINE_USERS);
    });

    socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, users => {
        $selectors.sliderList.empty();
        if (users.length !== 0) {
            onlineUsers = users;
        }
        for (let user of users) {
            if (user.token !== token) {
                $selectors.sliderList.append(`<div class="slider-item playersList-elem">
                    <p class="nickPlayer">${user.nick}</p>
                    <!--<button class="inviteToPartyBtn" title="Пригласить в группу" data-val=${user.idDB}>+</button>-->
                </div>`);
            } else {
                $selectors.sliderList.append(`<div class="slider-item playersList-elem">
                     <p class="nickPlayer">${user.nick}</p>
                 </div>`);
            }
        }
        //inviteToPartyHandler();
    });

    socket.on(SOCKET_EVENTS.NEW_USER_CAME, user => {
        if (user.token !== token && !(onlineUsers.find(user => { return user.token === user.token; }))) {
            $selectors.sliderList.append(`<div class="slider-item playersList-elem">
                        <p class="nickPlayer">${user.nick}</p>
                        <!--<button class="inviteToPartyBtn" title="Пригласить в группу" data-val=${user.idDB}>+</button>-->
                    </div>`);
            //inviteToPartyHandler();
        }
    });

    /*socket.on(SOCKET_EVENTS.NEW_USER_QUIT, id => {
       const buttons = $('.inviteToPartyBtn');
       for (let button of buttons) {
           let btn = $(button);
           if (btn.data('val') === id) {
               $(btn.parent()).remove();
           }
       }
    });*/

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
        mediator.subscribe(MEDIATOR_EVENTS.PARTY_BUTTONS_HANDLER, buttonsHandlerUp);
    }
    init();

}