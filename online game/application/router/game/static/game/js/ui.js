function UI(options) {

    const $selectors = options.$selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const socket = options.socket;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const mediator = options.mediator;
    let interval;
    const TICK = 1000;

    let isShownGame = false;
    let isShownGlobal = false;

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

    socket.on(SOCKET_EVENTS.SHOW_GAME_RECORDS, players => {
        if (players) {
            fillTable(players);
        }
    });

    socket.on(SOCKET_EVENTS.SHOW_GLOBAL_RECORDS, players => {
        if (players) {
            console.log(players);
            fillTable(players);
        }
    });

    $selectors.exitBtn.on('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
            socket.emit(SOCKET_EVENTS.DELETE_TOKEN, localStorage.getItem('token'));
        }
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
    }

    init();

}