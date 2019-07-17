function Slider(options) {

    options = (options instanceof Object) ? options : {};
    const STEP = options.step || 100;
    const DIRECTION = { UP: 'UP', DOWN: 'DOWN' };
    const $playersList = $('.playersList');
    const $messList = $('.messagesBlock');

    const height = {
        users: undefined,
        messages: undefined,
    };
    const defaultOffset = { // первоначальный отступ блока
        users: undefined,
        messages: undefined,
    };
    let slider;
    let downBorder; // нижняя граница скролла
    let workingHeight = null; //текущая выоста родителя

    this.DIRECTION = DIRECTION;
    this.slide = (direction, section) => {
        let defOff = 0;
        if (section === 'users') {
            slider = $('.sliderList');
            defaultOffset.users = (defaultOffset.users) ? defaultOffset.users: slider.offset().top;
            defOff = defaultOffset.users;
            height.users = $playersList.height();
            downBorder = height.users - slider.height();
            workingHeight = $playersList.height();
        } else if(section ==='messages') {
            slider = $('.messagesList');
            defaultOffset.messages = (defaultOffset.messages) ? defaultOffset.messages: slider.offset().top;
            defOff = defaultOffset.messages;
            height.messages =  $messList.height();
            downBorder = height.messages - slider.height();
            workingHeight = $messList.height();
        } else if (section === 'party') {
            slider = $('.sliderPartyList');
            defaultOffset.messages = (defaultOffset.messages) ? defaultOffset.messages: slider.offset().top;
            defOff = defaultOffset.messages;
            height.messages =  $messList.height();
            downBorder = height.messages - slider.height();
            workingHeight = $messList.height();
        }
        switch (direction) {
            case 'UP':
                let up = Math.round(slider.offset().top - STEP - defOff);
                if (workingHeight < slider.height()) {
                    slider.css('top', ((up > downBorder ) ? up : downBorder) + 'px');
                }
                break;
            case 'DOWN':
                let down = Math.round(slider.offset().top + STEP - defOff);
                slider.css('top', (down > 0 ? 0 : down) + 'px');
                break;
        }
    };
}

function UI(options) {

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const socket = options.socket;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const mediator = options.mediator;
    let interval;
    const TICK = 1000;
    const slider = new Slider({ step: 10 });

    let isShownGame = false;
    let isShownGlobal = false;
    let isSettings = false;

    function eventsUp() {
        $selectors.agree.off('click');
        $selectors.disagree.off('click');
        //согласие
        $selectors.agree.on('click', () => {
            socket.emit(SOCKET_EVENTS.PLAY_AGAIN);
        });
        //отказ
        $selectors.disagree.on('click', () => {
            const token = localStorage.getItem('token');
            if (token) {
                socket.emit(SOCKET_EVENTS.DELETE_TOKEN, localStorage.getItem('token'));
            }
        });
    }

    function setScore (score) {
        $selectors.score.empty();
        $selectors.score.append(score);
    }

    function showGameRecords() {
        $selectors.showGameRecords.off('click');
        $selectors.showGameRecords.on('click', () => {
            if (!isShownGame && !isShownGlobal) { //if both hide
                interval = setInterval(() => { socket.emit(SOCKET_EVENTS.SHOW_GAME_RECORDS); }, TICK);
                $selectors.records.show();
                $selectors.showGameRecords.empty();
                $selectors.showGameRecords.append('Скрыть рекорды игры');
            }
            if (!isShownGame && isShownGlobal) { //if global was opened
                clearInterval(interval);
                interval = null;
                $selectors.recordsBody.empty();
                interval = setInterval(() => { socket.emit(SOCKET_EVENTS.SHOW_GAME_RECORDS); }, TICK);
                $selectors.showGameRecords.empty();
                $selectors.showGlobalRecords.empty();
                $selectors.showGameRecords.append('Скрыть рекорды игры');
                $selectors.showGlobalRecords.append('Показать глобальные рекорды');
                isShownGlobal = !isShownGlobal;
            }
            if (isShownGame) { //if want to close
                clearInterval(interval);
                interval = null;
                $selectors.recordsBody.empty();
                $selectors.records.hide();
                $selectors.showGameRecords.empty();
                $selectors.showGameRecords.append('Показать рекорды игры');
            }
            isShownGame = !isShownGame;
        });
    }

    function showGlobalRecords() {
        $selectors.showGlobalRecords.off('click');
        $selectors.showGlobalRecords.on('click', () => {
            if (!isShownGlobal && !isShownGame) { //if both hide
                interval = setInterval(() => { socket.emit(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS); }, TICK);
                $selectors.records.show();
                $selectors.showGlobalRecords.empty();
                $selectors.showGlobalRecords.append('Скрыть глобальные рекороды');
            }
            if(!isShownGlobal && isShownGame) { //if game's records was opened
                clearInterval(interval);
                interval = null;
                $selectors.recordsBody.empty();
                interval = setInterval(() => { socket.emit(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS); }, TICK);
                $selectors.showGlobalRecords.empty();
                $selectors.showGameRecords.empty();
                $selectors.showGlobalRecords.append('Скрыть глобальные рекорды');
                $selectors.showGameRecords.append('Показать рекорды игры');
                isShownGame = !isShownGame;
            }
            if (isShownGlobal) {
                $selectors.recordsBody.empty();
                $selectors.records.hide();
                clearInterval(interval);
                interval = null;
                $selectors.showGlobalRecords.empty();
                $selectors.showGlobalRecords.append('Показать глобальные рекорды');
            }
            isShownGlobal = !isShownGlobal;
        });
    }

    function fillTable(players) {
        const sortedPlayers = players.sort((a, b) => {
            if (a.score < b.score) { return 1; }
            if (a.score > b.score) { return -1; }
            if (a.score === b.score) { return 0; }
        });
        let str = '';
        let pos = 0;
        for (let player of sortedPlayers) {
            pos++;
            str += `<tr><td class="posRec">${pos}</td><td class="nickRec">${player.nick}</td><td class="record">${player.score}</td></tr>`;
        }
        $selectors.recordsBody.empty();
        $selectors.recordsBody.append(str);
    }

    function changeHandler() {
        let btn; let nick; let color;
        if (!isSettings) {
            btn = $('.changeBtn');
            nick = $('.newNick');
            color = $('.newColor');
            btn.on('click', () => {
                const newNick = nick.val();
                const newColor = color.val();
                if (newNick || newColor) {
                    socket.emit(SOCKET_EVENTS.CHANGE_USER, { newNick, newColor });
                }
            });
        } else {
             $('.newNick').val('');
             $('.newColor').val('');
        }
    }

    socket.on(SOCKET_EVENTS.CHANGE_USER, () => {
        $selectors.userBlock.hide();
        isSettings = !isSettings;
        $('.newNick').val('');
        $('.newColor').val('');
    });

    socket.on(SOCKET_EVENTS.SHOW_GAME_RECORDS, players => {
        if (players) {
            fillTable(players);
        }
    });

    socket.on(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS, players => {
        if (players) {
            fillTable(players);
        }
    });

    $selectors.exitBtn.on('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
            socket.emit(SOCKET_EVENTS.DELETE_TOKEN, localStorage.getItem('token'));
        }
    });

    $selectors.playersList.on('wheel', event => {
        slider.slide(event.originalEvent.wheelDelta < 0 ? slider.DIRECTION.UP : slider.DIRECTION.DOWN, "users");
    });

    $selectors.messagesList.on('wheel', event => {
        slider.slide(event.originalEvent.wheelDelta < 0 ? slider.DIRECTION.UP : slider.DIRECTION.DOWN, 'messages');
    });

    $selectors.chats.off('click').on('click', function () {
        $selectors.chats.removeClass('selected-chat');
        $(this).addClass('selected-chat');
    });

    $selectors.settingsButton.off('click').on('click', () => {
        if (!isSettings) {
            $selectors.userBlock.show();
        } else {
            $selectors.userBlock.hide();
        }
        changeHandler();
        isSettings = !isSettings
    });

    socket.on(SOCKET_EVENTS.DELETE_TOKEN, data => {
        if (data.code === 200) {
            localStorage.removeItem('token');
            $('.exitBtn').off('click');
            window.location.href = '/';
        }
    });

    function init() {
        mediator.subscribe(MEDIATOR_EVENTS.EVENTS_UP, eventsUp);
        mediator.subscribe(MEDIATOR_EVENTS.SET_SCORE, setScore);
        mediator.subscribe(MEDIATOR_EVENTS.SHOW_GAME_RECORDS, showGameRecords);
        mediator.subscribe(MEDIATOR_EVENTS.SHOW_GLOBAL_RECORDS, showGlobalRecords);
        mediator.subscribe(MEDIATOR_EVENTS.SLIDE_PARTY_ELEMS, () => {
            $selectors.partyList.on('wheel', event => {
                slider.slide(event.originalEvent.wheelDelta < 0 ? slider.DIRECTION.UP : slider.DIRECTION.DOWN, 'party');
            });
        });
    }

    init();

}