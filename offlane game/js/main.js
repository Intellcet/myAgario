$(() => {
    const canvasBlock = $('.canvasBlock');

    let width = (canvasBlock.width() > canvasBlock.height()) ? canvasBlock.height() : canvasBlock.width();
    let height = (canvasBlock.width() < canvasBlock.height()) ? canvasBlock.width() : canvasBlock.height();

    let game;

    const manager = new Manager(width, height);

    const ui = new UI({
        start:() => {
            startGame();
        },
        changeNick: nickname => {
            manager.changeNick(nickname);
        },
        changeColor: color => {
            manager.changeColor(color);
        },
        playAgain: () => {
            startGame();
        }
    });

    function startGame() {
        if (!game) {
            manager.resetScore();
            game = setInterval(() => {
                if(manager.play()) {
                    clearInterval(game);
                    ui.gameOver();
                    game = null;
                }
                ui.getScore(manager.getScore());
            }, 17);
        }
    }
});





