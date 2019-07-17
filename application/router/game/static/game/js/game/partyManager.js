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

    socket.on(SOCKET_EVENTS.SEND_INVITE_TO_PARTY, data => {
        if (data.answer === 200) {
            //успешный инвайт
            $selectors.party.show();
            console.log('SUCCESS');
            mediator.call(MEDIATOR_EVENTS.SLIDE_PARTY_ELEMS);
            mediator.call(MEDIATOR_EVENTS.PARTY_BUTTONS_HANDLER);
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
    //TODO::  Реализовать логику добавления в группу.
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
            mediator.call(MEDIATOR_EVENTS.SLIDE_PARTY_ELEMS);
            mediator.call(MEDIATOR_EVENTS.PARTY_BUTTONS_HANDLER);
            socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
        }
    });

    socket.on(SOCKET_EVENTS.TAKE_INVITE_FOR_PARTY_LEADER, data => {
        if (data.answer === 200) {
            //успешный инвайт
            $selectors.party.show();
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
        $selectors.party.hide();
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, () => {
        socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
    });

    socket.on(SOCKET_EVENTS.LEADER_LEFT, () => {
        socket.emit(SOCKET_EVENTS.GET_PARTY_USERS, token);
        $selectors.playersOnlineStr.empty();
        $selectors.playersOnlineStr.append('Игроков в сети: ');
    });

}