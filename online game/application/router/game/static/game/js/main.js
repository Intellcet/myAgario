﻿window.onload = () => {
  if (!localStorage.getItem('token')) {
      window.location.href = '/';
  }
};
$(() => {

    const storage = localStorage;

    const $selectors = {
        nick: $('.nick'),               color: $('.color'),         score: $('.score'),         agree: $('.agree-btn'),       disagree: $('.disagree-btn'), showGameRecords: $('.showGameRecordsBtn'), showGlobalRecords: $('.showGlobalRecordsBtn'),
        canvasBlock: $('.canvasBlock'), loseBlock: $('.loseBlock'), scoreBlock: $('.scoreBlock'), loseString: $('.loseString'), records: $('.records'), recordsBody: $('.records-body'), exitBtn: $('.exitBtn'),
    };
    const SOCKET_EVENTS = {
        LOGIN: 'USER LOGIN',
        READY: 'USER READY TO PLAY',
        UPDATE_SCENE: 'UPDATE SCENE',
        MOVEMENT: 'MOVEMENT OF THE BALL',
        GAME_OVER: 'GAME IS OVER',
        PLAY_AGAIN: 'PLAY AGAIN',
        LOGGED_IN: 'LOGGED IN',
        SHOW_GAME_RECORDS: 'show game records',
        SHOW_GLOBAL_RECORDS: 'show global records',
        DELETE_TOKEN: 'delete token',
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
        SHOW_GAME_RECORDS: 'show game records',
        SHOW_GLOBAL_RECORDS: 'show global records',
    };

    const mediator = new Mediator({ MEDIATOR_EVENTS });


    function showPage(page) {
        $selectors.canvasBlock.hide();
        $selectors.scoreBlock.hide();
        $selectors.loseBlock.hide();
        switch(page) {
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

    //TODO::Сделать онлайн изменение рекордов(глобально) и в рамках играющих игроков

    function init() {
        const token = storage.getItem('token');
        if (token) {
            mediator.subscribe(MEDIATOR_EVENTS.SHOW_PAGE, showPage);
            const socket = io('http://localhost:3000');
            new UI({ $selectors, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator });
            new UserManager({ $selectors, SOCKET_EVENTS, MEDIATOR_EVENTS, socket, mediator });
        }
    }
    init();




});



