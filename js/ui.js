function UI(callbacks) {

    this.score;

    var start = callbacks.start;
    var changeNick = callbacks.changeNick;
    var changeColor = callbacks.changeColor;

    var i = 0;

    var div = document.createElement('div');
    div.setAttribute('style', 'float:left');
    var divL = document.createElement('div');
    divL.setAttribute('style', 'float:left');

    function createBr() {
        var br = document.createElement('br');
        i++;
        return br;
    }

    //надпись для ника
    var spanForNick = document.createElement('span');
    spanForNick.setAttribute('type', 'span');
    spanForNick.innerHTML = 'Введите nickname ';
    //поле ввода ника
    var fieldForNick = document.createElement('input');
    fieldForNick.setAttribute('type', 'input');
    fieldForNick.addEventListener('keyup', function () {
        changeNick(fieldForNick.value);
    });
    //надпись для цвета
    var spanForColor = document.createElement('span');
    spanForColor.setAttribute('type', 'span');
    spanForColor.innerHTML = 'Укажите цвет игрока ';
    //поле ввода цвета
    var fieldForColor = document.createElement('input');
    fieldForColor.setAttribute('type', 'input');
    fieldForColor.addEventListener('keyup', function () {
        changeColor(fieldForColor.value);
    });
    //Надпись для рекорда
    var spanScore = document.createElement('span');
    spanScore.setAttribute('type', 'span');
    
    //Кнопка играть
    var buttonPlay = document.createElement('input');
    buttonPlay.setAttribute('type', 'button');
    buttonPlay.setAttribute('value', 'StartPlay');
    buttonPlay.addEventListener('mouseup', function () {
        start();
        document.querySelector('body').removeChild(div);
        divL.appendChild(spanScore);
    });
    //Надпись для проигрыша
    var spanForLose = document.createElement('span');
    spanForLose.setAttribute('type', 'span');
    spanForLose.innerHTML = 'Вы проиграли! Хотите сыграть еще раз?';
    //Согласие
    var buttonAgree = document.createElement('input');
    buttonAgree.setAttribute('type', 'button');
    buttonAgree.setAttribute('value', 'Да!');
    buttonAgree.addEventListener('mouseup', function () {
        location.reload();
    });
    //Отказ
    var buttonDisagree = document.createElement('input');
    buttonDisagree.setAttribute('type', 'button');
    buttonDisagree.setAttribute('value', 'Нет!');
    buttonDisagree.addEventListener('mouseup', function () {
        window.close();
    });
    //добавление в блок

    div.appendChild(spanForNick);
    div.appendChild(fieldForNick);
    div.appendChild(createBr());
    div.appendChild(spanForColor);
    div.appendChild(fieldForColor);
    div.appendChild(createBr());
    div.appendChild(buttonPlay);

    this.gameOver = function () {
        divL.appendChild(createBr());
        divL.appendChild(spanForLose);
        divL.appendChild(createBr());
        divL.appendChild(buttonAgree);
        divL.appendChild(buttonDisagree);
    }

    this.getScore = function (score) {
        spanScore.innerHTML = 'Съедено: ' + score;
    };

    function init() {
        document.querySelector('body').appendChild(div);
        document.querySelector('body').appendChild(divL);
    }


    init();


};