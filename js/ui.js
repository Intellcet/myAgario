function UI(callbacks) {

    const start = callbacks.start;
    const changeNick = callbacks.changeNick;
    const changeColor = callbacks.changeColor;
    const playAgain = callbacks.playAgain;

    const selectors = { nick: $('.nick'), color: $('.color'), score: $('.score'), agree: $('.agree-btn'), disagree: $('.disagree-btn') };

    //Кнопка играть
    $('.startBtn').on('click', () => {
        if (selectors.nick.val()) { changeNick(selectors.nick.val()); }
        if (selectors.color.val()) { changeColor(selectors.color.val()); }
        start();

    });

    function eventsUp() {
        selectors.agree.off('click');
        selectors.disagree.off('click');
        //согласие
        selectors.agree.on('click', () => {
            playAgain();
        });
        //отказ
        selectors.disagree.on('click', () => {
            window.close();
        });
    }

    this.gameOver = () => {
        $('.loseBlock').show();
        eventsUp();
    };

    this.getScore = score => {
        selectors.score.empty();
        selectors.score.append(score);
    };
}