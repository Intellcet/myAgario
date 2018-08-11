$(() => {
    const $selectors = {
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

    const MEDIATOR_EVENTS = {
        SHOW_PAGE: 'show page',
        SET_SCORE: 'set score',
        EVENTS_UP: 'events up',
        GET_CANVAS: 'get canvas',
        FILL_RENDER: 'fill render',
        FILL_RECT: 'fill rect',
        CIRCLE: 'print circle',
        SPRITE: 'print sprite',
        PRINT_TEXT: 'print text',
    };

    const mediator = new Mediator({ MEDIATOR_EVENTS });

    const socket = io('http://localhost:3000');

    function showPage(page) {
        $selectors.canvasBlock.hide();
        $selectors.scoreBlock.hide();
        $selectors.loseBlock.hide();
        $selectors.infoBlock.hide();
        switch(page) {
            case 'info':
                $selectors.infoBlock.show();
                break;
            case 'game':
                $selectors.canvasBlock.show();
                $selectors.scoreBlock.show();
                break;
            case 'game over':
                $selectors.canvasBlock.show();
                $selectors.scoreBlock.show();
                $selectors.loseBlock.show();
                break;
        }
    }

    function init() {
        mediator.subscribe(MEDIATOR_EVENTS.SHOW_PAGE, showPage);
        new UI({ $selectors, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator });
        new UserManager({ $selectors, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator });
        showPage('info');
    }
    init();

});



