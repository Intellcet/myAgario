const struct = require('./struct');
const GenerateNicks = require('./generateNicks');

function Game(options) {

    options = (options instanceof Object) ? options : {};
    const db = options.db;
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const mediator = options.mediator;

    let interval;
    const Ball = struct.Ball;
    const Food = struct.Food;
    const Field = struct.Field;

    const screen = new Field(100, 100, -50, -50);
    const food = []; //массив со всей едой
    const balls = [];//массив всех шаров

    const FOOD_COUNT = 2500;
    const TICK = 17;

    const nicks = new GenerateNicks();

    function updateScene() {
        for(let player of balls) {
            printFood(player.id);
            printBalls(player.id);
            move(player.id);
            eat(player.id);
        }
        mediator.call(MEDIATOR_EVENTS.UPDATE_SCENE, balls);
    }

    function createNewPlayer(user, size) {
        const koord = { x: Math.floor(Math.random() * screen.width + screen.left), y: Math.floor(Math.random() * screen.height + screen.bottom) };
        const player = new Ball(
            koord.x,
            koord.y,
            0.1,
            user.color,
            user.nick || nicks.genNick(),
            user.id
        );
        player.idDB = user.idDB;
        player.frame.left = player.x - player.frame.width / 2;
        player.frame.bottom = player.y - player.frame.height/ 2;
        player.canvas.width = size.width;
        player.canvas.height = size.height;
        player.local.x = getXs(player.x, player.frame, player.canvas);
        player.local.y = getYs(player.y, player.frame, player.canvas);
        balls.push(player);
        for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            for (let j = 0; j < balls.length; j++) {
                if (!ball.scene.balls.find(b => { return b.id === balls[j].id })) {
                    ball.scene.balls.push(balls[j])
                }
            }
        }
        db.updateUser(player.idDB, { nickname: player.name });
        return player;
    }

    //From local to ekran
    function getXs(x, frame, canvas) {
        return (x - frame.left) * canvas.width / frame.width;
    }

    function getYs(y, frame, canvas) {
        return canvas.height - (y - frame.bottom) * canvas.height / frame.height;
    }

    //из экранной в локальную
    function getX(x, frame, canvas) {
        return frame.width * x / canvas.width + frame.left;
    }

    function getY(y, frame, canvas) {
        return - ((y - canvas.height) * frame.height / canvas.height) + frame.bottom;
    }

    function pushFood() {//заполняем еду
        food.splice(0, food.length);
        for (let i = 0; i < FOOD_COUNT; i++) {
            food.push(new Food(
                Math.random() * screen.width + screen.left,
                Math.random() * screen.height + screen.bottom,
                1/10
            ));
        }
    }

    function rollFood(food) {
        switch (food.roll) {
            case 1:
                food.img = { x: 20,  y: 77,  xs: 104, ys: 109 };
                break;
            case 2:
                food.img = { x: 156, y: 76,  xs: 85,  ys: 119 };
                break;
            case 3:
                food.img = { x: 260, y: 75,  xs: 129, ys: 117 };
                break;
            case 4:
                food.img = { x: 24,  y: 206, xs: 97,  ys: 117 };
                break;
            case 5:
                food.img = { x: 137, y: 205, xs: 123, ys: 120 };
                break;
        }
    }

    function printFood(id) {//рисуем еду
        const player = balls.find(ball => { return ball.id === id; });
        if (player) {
            player.scene.food.splice(0, player.scene.food.length);
            const fw_fl = player.frame.width + player.frame.left;
            const fh_fb = player.frame.height + player.frame.bottom;
            for (let _food of food) {
                rollFood(_food);
                const center = _food.center();
                const radius = _food.getRadius();
                if(center.x + radius > player.frame.left &&
                    center.x - radius < fw_fl &&
                    center.y + radius > player.frame.bottom &&
                    center.y - radius < fh_fb) {
                    player.scene.food.push({ center: { x: getXs(center.x, player.frame, player.canvas), y: getYs(center.y, player.frame, player.canvas) }, radius, color: _food.getColor(), nick: null, img: _food.img });
                }
            }
        }

    }

    function printBalls(id) {//рисуем шары
        const player = balls.find(ball => { return ball.id === id; });
        if (player) {
            player.scene.balls.splice(0, player.scene.balls.length);
            const fw_fl = player.frame.width + player.frame.left;
            const fh_fb = player.frame.height + player.frame.bottom;
            for(let ball of balls) {
                const center = ball.center();
                const radius = ball.getRadius();
                if(center.x + radius > player.frame.left &&
                    center.x - radius < fw_fl &&
                    center.y + radius > player.frame.bottom &&
                    center.y - radius < fh_fb) {
                    player.scene.balls.push({ center: { x: getXs(center.x, player.frame, player.canvas), y: getYs(center.y, player.frame, player.canvas) }, radius, color: ball.getColor(), nick: ball.getName() });
                }
            }
        }

    }

    function eat(id) {//едим
        const player = balls.find(ball => { return ball.id === id; });
        if (player) {
            const radius = player.getRadius();
            for(let _food of food) {
                if(_food.getRast(_food, player) < radius) {
                    const mass = _food.getMass() / player.getMass() * 0.05;
                    player.eat(mass);
                    player.score++;
                    mediator.call(MEDIATOR_EVENTS.CHANGE_USER_SCORE, player.id);
                    db.updateUser(player.idDB, true);
                    food.splice(food.indexOf(_food), 1);
                    food.push(new Food(
                        Math.random() * screen.width + screen.left,
                        Math.random() * screen.height + screen.bottom,
                        1/10
                    ));
                }
            }
            for (let ball of balls) {
                if(ball.getRast(ball, player) < radius && radius > ball.getRadius() && ball.id !== player.id) {
                    const mass = ball.getMass() / player.getMass() * 0.05;
                    player.eat(mass);
                    player.score++;
                    db.updateUser(player.idDB, true);
                    mediator.call(MEDIATOR_EVENTS.CHANGE_USER_SCORE, player.id);
                    mediator.call(MEDIATOR_EVENTS.GAME_OVER, ball);
                    balls.splice(balls.indexOf(ball), 1);
                }
            }
            player.radius = player.getRadius();
        }

    }

    function move(id) {
        const player = balls.find(ball => { return ball.id === id; });
        if (player) {
            player.move(screen);
        }
    }

    function init() {
        pushFood();
        interval = setInterval(updateScene, TICK);
    }

    this.direction = (id, x, y) => {//устанавливаем направление движения игрока
        const player = balls.find(ball => { return ball.id === id; });
        if (player) {
            const dx = getX(x, player.frame, player.canvas) - player.x;
            const dy = getY(y, player.frame, player.canvas) - player.y;
            player.setDirection(dx, dy);
        }
    };

    this.start = (user, size) => {
        createNewPlayer(user, size);
    };

    this.finish = id => {
      const player = balls.find(ball => { return ball.id === id; });
      if (player) {
          balls.splice(balls.indexOf(player), 1);
          return true;
      }
    };

    init();
}

module.exports = Game;