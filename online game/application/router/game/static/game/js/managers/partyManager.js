function PartyManager(options) {

    options = (options instanceof Object) ? options : {};

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const socket = options.socket;
    const mediator = options.mediator;

    const token = localStorage.getItem('token');

    function notificationHandler(nick, id) {
        const $str = $('.playersName');
        const notifBtns = $('.notificationBtn');
        if (nick) {
            $str.empty();
            $str.append(nick);
            notifBtns.off('click');
            $('.agreeInviteBtn').on('click', () => {
                $selectors.party.show();
                $selectors.notification.hide();
                socket.emit(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, { id, answer: 200 });
                notifBtns.off('click');
            });
            $('.disagreeInviteBtn').on('click', () => {
                $selectors.notification.hide();
                socket.emit(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, { answer: 100 });
                notifBtns.off('click');
            });
        }
    }

    function showWait() {
        const svg = `<svg class="waiting" height="100px" width="200px">
                                <circle id="circle-1" cx="30" cy="50" r="20" stroke="#00dd00" stroke-width="1" fill="#00dd00"></circle>
                                <circle id="circle-2" cx="80" cy="50" r="20" stroke="#00dd00" stroke-width="1" fill="#00dd00"></circle>
                                <circle id="circle-3" cx="130" cy="50" r="20" stroke="#00dd00" stroke-width="1" fill="#00dd00"></circle>
                            </svg>`;
        $selectors.commonChat.removeClass("selected-chat");
        $selectors.partyChat.removeClass("selected-chat").addClass("selected-chat");
        $selectors.sliderMessages.empty().append(svg);
    }

    socket.on(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, data => {
        switch (data.answer) {
            case 200: //успешный инвайт
                showWait();
                console.log('SUCCESS');
                break;
            case 100: //игрок в группе
                $selectors.party.show();
                $('.sliderPartyList').append('<p class="partyErrMess">Этот игрок уже находится в группе.</p>');
                setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
                break;
            case 10: //находитесь в группе, в которой не являетесь ее лидером
                $selectors.party.show();
                $('.sliderPartyList').append('<p class="partyErrMess">Вы находитесь в группе, в которой не являетесь лидером.</p>');
                setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
                break;
            case 0: //игрок вышел
                $selectors.party.show();
                $('.sliderPartyList').append('<p class="partyErrMess">Этот игрок вышел.</p>');
                setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
                break;
        }
    });

    socket.on(SOCKET_EVENTS.ANSWER_ON_INVITE_TO_PARTY, data => {
        //сообщение об инвайте
        if (data.nick) {
            $selectors.notification.show();
            notificationHandler(data.nick, data.id);
        }
    });

    socket.on(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY, data => {
        //сообщение о результате инвайта
        if (data.answer === 100) {
            $selectors.party.show();
            $('.sliderPartyList').append('<p class="partyErrMess">Игрок, пригласивший вас в группу вышел.</p>');
            setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
        } else {
            $selectors.party.show();
            console.log('SUCCESS');
            $selectors.sliderMessages.empty();
            $selectors.commonChat.removeClass("selected-chat");
            $selectors.partyChat.removeClass("selected-chat").addClass("selected-chat");
            mediator.call(MEDIATOR_EVENTS.SLIDE_PARTY_ELEMS);
            mediator.call(MEDIATOR_EVENTS.PARTY_BUTTONS_HANDLER);
            socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
        }
    });

    socket.on(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, data => {
        if (data.answer === 200) {
            //успешный инвайт
            $selectors.party.show();
            $selectors.sliderMessages.empty();
            $selectors.commonChat.removeClass("selected-chat");
            $selectors.partyChat.removeClass("selected-chat").addClass("selected-chat");
            mediator.call(MEDIATOR_EVENTS.SLIDE_PARTY_ELEMS);
            mediator.call(MEDIATOR_EVENTS.PARTY_BUTTONS_HANDLER);
            socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
        } else if (data.answer === 100) {
            $selectors.party.show();
            $('.sliderPartyList').append('<p class="partyErrMess">Этот игрок уже находится в группе.</p>');
            setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
        } else { // answer === 0
            $selectors.party.show();
            $('.sliderPartyList').append('<p class="partyErrMess">Этот игрок вышел.</p>');
            setTimeout(() => { $('.partyErrMess').remove(); $selectors.party.hide(); }, 1500);
        }
    });

    socket.on(SOCKET_EVENTS.GET_PARTY_USERS, data => {
        if  (data.users) {
            const $partyList = $('.sliderPartyList');
            $partyList.empty();
            for (let user of data.users) {
                $partyList.append(`<div class="slider-item sliderPartyList-elem">
                                        <p class="nickPlayer">${user.nickname}</p></div>`);
            }
        }
    });

    socket.on(SOCKET_EVENTS.LEAVE_FROM_PARTY, () => {
        $('.sliderPartyList').empty();
        $selectors.partyChat.removeClass("selected-chat");
        $selectors.commonChat.removeClass("selected-chat").addClass("selected-chat");
        $selectors.sliderMessages.empty();
        $selectors.party.hide();
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, () => {
        socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
    });

    socket.on(SOCKET_EVENTS.LEADER_LEFT, () => {
        socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
        $selectors.partyChat.removeClass("selected-chat");
        $selectors.commonChat.removeClass("selected-chat").addClass("selected-chat");
        $selectors.sliderMessages.empty();
        $selectors.playersOnlineStr.empty();
        $selectors.playersOnlineStr.append('Игроков в сети: ');
    });

}