function UI(options) {

    const selectors = options.selectors;
    const SOCKET_EVENTS = options.SOCKET_EVENTS;
    const socket = options.socket;

    //Кнопка играть
    $('.startBtn').on('click', () => {
        let nick = null; let color = null;
        if (selectors.nick.val() ) { nick = selectors.nick.val(); }
        if (selectors.color.val()) { color = selectors.color.val(); }
        selectors.nick.val('');
        selectors.color.val('');
        socket.emit(SOCKET_EVENTS.LOGIN, { nick, color });
    });

    this.eventsUp = () => {
        selectors.agree.off('click');
        selectors.disagree.off('click');
        //согласие
        selectors.agree.on('click', () => {
            socket.emit(SOCKET_EVENTS.PLAY_AGAIN);
        });
        //отказ
        selectors.disagree.on('click', () => {
            window.close();
        });
    };

    this.setScore = score => {
        selectors.score.empty();
        selectors.score.append(score);
    };
}