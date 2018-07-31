$(() => {
    const selectors = {
        nick: $('.nick'),               color: $('.color'),         score: $('.score'),         agree: $('.agree-btn'),       disagree: $('.disagree-btn'),
        canvasBlock: $('.canvasBlock'), infoBlock: $('.infoBlock'), loseBlock: $('.loseBlock'), scoreBlock: $('.scoreBlock'), loseString: $('.loseString'),
    };
    const SOCKET_EVENTS = {
        LOGIN: 'USER LOGIN',
        READY: 'USER READY TO PLAY',
        UPDATE_SCENE: 'UPDATE SCENE',
        MOVEMENT: 'MOVEMENT OF THE BALL',
        GAME_OVER: 'GAME IS OVER',
        PLAY_AGAIN: 'PLAY AGAIN',
    };
    const socket = io('http://localhost:3000');

    function showPage(page) {
        selectors.canvasBlock.hide();
        selectors.scoreBlock.hide();
        selectors.loseBlock.hide();
        selectors.infoBlock.hide();
        switch(page) {
            case 'info':
                selectors.infoBlock.show();
                break;
            case 'game':
                selectors.canvasBlock.show();
                selectors.scoreBlock.show();
                break;
            case 'game over':
                selectors.canvasBlock.show();
                selectors.scoreBlock.show();
                selectors.loseBlock.show();
                break;
        }
    }

    const ui = new UI({ selectors, SOCKET_EVENTS, socket });
    new UserManager({ selectors, SOCKET_EVENTS, socket, showPage, setScore: ui.setScore, eventsUp: ui.eventsUp });

    showPage('info');
});



