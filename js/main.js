window.onload = function () {

    var width = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
    var height = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;

    var manager = new Manager(width, height);

    var ui = new UI({
        start: function () {
            startGame();
        },
        changeNick: function (nickname) {
            manager.changeNick(nickname)
        },
        changeColor: function (color) {
            manager.changeColor(color)
        }
    });

    function startGame() {
        var game = setInterval(function () {
            if(manager.play()) {
                clearInterval(game);
                ui.gameOver();
            }
            ui.getScore(manager.getScore());
        }, 17);
    }

};