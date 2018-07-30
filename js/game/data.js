function Circle(x, y, mass, color) {

    this.x = x;
    this.y = y;
    this.mass = mass;
    this.color = (color) ? color : "rgb(" + Math.floor(Math.random() * 256) +", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";


    this.center = () => {
        return { x: this.x, y: this.y };
    };

    this.getMass = () => {
        return this.mass;
    };

    this.getColor = () => {
        return this.color;
    };

    this.getRadius = () => {
        return Math.sqrt(this.mass / Math.PI);
    };
}

function Ball(_x, _y, _mass, _color, _name) {

    Circle.call(this, _x, _y, _mass, _color);

    let dx = 0;
    let dy = 0;

    this.name = _name;

    this.getName = () => {
        return this.name
    };

    this.getDirection = () => {
        return { dx, dy };
    };

    this.setDirection = (_dx, _dy) => {
        dx = _dx;
        dy = _dy;
        const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(d > 1) {
            dx = dx / d;
            dy = dy / d;
        }
        return { dx, dy };
    };
	

    this.getSpeed = () => {
        return 1 / (10 * Math.pow(this.mass, 1 / 7));
    };

    this.move = (frame, screen) => {
        const speed = this.getSpeed();
        if(this.x <= screen.left + screen.width && this.x >= screen.left) {
            this.x += speed * this.getDirection().dx;
            frame.left += speed * this.getDirection().dx;
        }
        if(this.x > screen.left + screen.width) {
            if(this.getDirection().dx > 0) {
                this.getDirection().dx = 0;
            }
            else {
                this.x += speed * this.getDirection().dx;
                frame.left += speed * this.getDirection().dx;
            }
        }
        if(this.x < screen.left) {
            if(this.getDirection().dx < 0) {
                this.getDirection().dx = 0;
            }
            else {
                this.x += speed * this.getDirection().dx;
                frame.left += speed * this.getDirection().dx;
            }
        }
        if(this.y <= screen.bottom + screen.height && this.y >= screen.bottom) {
            this.y += speed * this.getDirection().dy;
            frame.bottom += speed * this.getDirection().dy;
        }
        if(this.y > screen.bottom + screen.height) {
            if(this.getDirection().dy > 0) {
                this.getDirection().dy = 0;
            } else {
                this.y += speed * this.getDirection().dy;
                frame.bottom += speed * this.getDirection().dy;
            }
        }
        if(this.y < screen.bottom) {
            if(this.getDirection().dy < 0) {
                this.getDirection().dy = 0;
            } else {
                this.y += speed * this.getDirection().dy;
                frame.bottom += speed * this.getDirection().dy;
            }
        }
    };

    this.eat = _mass => {
        this.mass += _mass;
    };

    this.getRast = (player, ball) => {
        const x = player.center().x - ball.center().x;
        const y = player.center().y - ball.center().y;
        return Math.sqrt(x * x + y * y);
    };

    this.moveAI = () => {// для ИИ
        const speed = this.getSpeed();
        this.x += speed * this.getDirection().dx;
        this.y += speed * this.getDirection().dy;
    };
}

function Food(_x, _y, _mass) {

    Circle.call(this, _x, _y, _mass);

    this.getRast = (food, ball) => {
        const x = food.center().x - ball.center().x;
        const y = food.center().y - ball.center().y;
        return Math.sqrt(x * x + y * y);
    };
    this.roll = Math.floor(Math.random() * 5 + 1);
}

function Field(width, height, left, bottom) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.bottom = bottom;
}


function Data(options) {

    const Height = options.height;
    const Width = options.width;

    const screen = new Field(100, 100, -50, -50);
    const frame = new Field(10, 10, -5, -5);

    const food = []; //массив со всей едой
    const balls = [];//массив всех шаров

    let score = 0;
    const FOOD_COUNT = 2500;
    const BALLS_COUNT = 7;

    const nicks = new GenerateNicks();
    let player = null;

    function createNewPlayer() {
        return new Ball(
            (frame.width + frame.left + frame.left) / 2,
            (frame.height + frame.bottom + frame.bottom) / 2,
            0.1,
            undefined,
            nicks.genNick()
        );
    }

    player = createNewPlayer();

    //From local to ekran
    function getXs(x) {
        return (x - frame.left) * Width / frame.width;
    }

    function getYs(y) {
        return Height - (y - frame.bottom) * Height / frame.height;
    }

    //из экранной в локальную
    function getX(x) {
        return frame.width * x / Width + frame.left;
    }

    function getY(y) {
        return - ((y - Height) * frame.height / Height) + frame.bottom;
    }

    function pushFood() {//заполняем еду
        food.splice(0, food.length);
        for (let i = 0; i < FOOD_COUNT; i++) {
            food.push(new Food(
                Math.random() * screen.width + screen.left,
                Math.random() * screen.height + screen.bottom,
                10 / (frame.width * frame.height)
            ));
        }
    }

    function pushBalls() {//заполняем шары
        balls.splice(0, balls.length);
        for (let i = 0; i < BALLS_COUNT; i++){
            balls.push(new Ball(
				Math.random() * screen.width + screen.left,
                Math.random() * screen.height + screen.bottom,
				0.1,
				undefined,
                nicks.genNick()
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

    function printFood(cb) {//рисуем еду
        const fw_fl = frame.width + frame.left;
        const fh_fb = frame.height + frame.bottom;
        for (let _food of food) {
            rollFood(_food);
            const center = _food.center();
            const radius = _food.getRadius();
            if(center.x + radius > frame.left &&
               center.x - radius < fw_fl &&
               center.y + radius > frame.bottom &&
               center.y - radius < fh_fb) {
                cb({ x: getXs(center.x), y: getYs(center.y) }, radius, _food.getColor(), null, _food.img);
            }
        }
    }

    function printBalls(cb) {//рисуем шары
        const fw_fl = frame.width + frame.left;
        const fh_fb = frame.height + frame.bottom;
        for(let ball of balls) {
            const center = ball.center();
            const radius = ball.getRadius();
            if(center.x + radius > frame.left &&
               center.x - radius < fw_fl &&
               center.y + radius > frame.bottom &&
               center.y - radius < fh_fb) {
                cb({ x: getXs(center.x), y: getYs(center.y) }, radius, ball.getColor(), ball.getName());
            }
        }
        if(player) {
            cb({ x: getXs(player.center().x), y: getYs(player.center().y) }, player.getRadius(), player.getColor(), player.getName());
        }
    }

    // function zoomFrame() { //отдаляет экран(полная хрень... ошибка в изменении длины/ширины/левого нижнего угла)
    //     if(frame.width / player.getRadius() < 27 && frame.height / player.getRadius() < 27) {
    //         frame.width += 0.05;
    //         frame.height += 0.05;
    //         frame.bottom -= 0.025;
    //         frame.left -= 0.025;
    //         for (let _food of food) {
    //             _food.mass = 10 / (frame.width * frame.height);
    //         }
    //     }
    // }

    function eat() {//едим
        const radius = player.getRadius();
        for(let _food of food) {
            if(_food.getRast(_food, player) < radius) {
                const mass = _food.getMass() / player.getMass() * 0.05;
	            player.eat(mass);
	            score++;
                food.splice(food.indexOf(_food), 1);
                food.push(new Food(
                    Math.random() * screen.width + screen.left,
                    Math.random() * screen.height + screen.bottom,
                    10 / (frame.width * frame.height)
                ));
			}
	    }
	    for (let ball of balls) {
	        if(ball.getRast(ball, player) < radius && radius > ball.getRadius()) {
	            const mass = ball.getMass() / player.getMass() * 0.05;
	            player.eat(mass);
	            score++;
                balls.splice(balls.indexOf(ball), 1);
                balls.push(new Ball(
                    Math.random() * screen.width + screen.left,
                    Math.random() * screen.height + screen.bottom,
                    0.1,
                    undefined,
                    nicks.genNick()
                ));
	        }
	    }
	    //zoomFrame();
	}

	function move() {
	    player.move(frame, screen);
	}
	
	function setMoveAI(food, ball) {//устанавливаем направление движения для ИИ
		const dx = food.center().x - ball.center().x;
		const dy = food.center().y - ball.center().y;
		ball.getDirection().dx = ball.setDirection(dx, dy).dx;
		ball.getDirection().dy = ball.setDirection(dx, dy).dy;
	}

	function eatAI(min,_ball) {
	    const radiusBall = _ball.getRadius();
	    const minRast = min.getRast(min, _ball);
	    for(let ball of balls) {
	        if(min === ball) {
	            if(minRast < radiusBall) {
	                const mass = min.getMass / _ball.getMass() * 0.05;
	                ball.eat(mass);
	                balls.splice(balls.indexOf(ball), 1);
	                balls.push(new Ball(
                        Math.random() * screen.width + screen.left,
                        Math.random() * screen.height + screen.bottom,
                        0.1,
                        undefined,
                        nicks.genNick()
                    ));
	            }
	            break;
	        }
	    }
	    for (let _food of food) {
	        if (min === _food) {
	            if (minRast < radiusBall) {
	                const mass = min.getMass() / _ball.getMass() * 0.05;
	                _ball.eat(mass);
	                food.splice(food.indexOf(_food), 1);
	                food.push(new Food(
                        Math.random() * screen.width + screen.left,
                        Math.random() * screen.height + screen.bottom,
                        10 / (frame.width * frame.height)
                    ));
	            }
	            break;
	        }
	    }
	    if(min === player) {
	        if(minRast < radiusBall) {
	            const mass = player.getMass() / _ball.getMass() * 0.05;
	            _ball.eat(mass);
	            player = null;
	        }
	    }
    }

	function moveAI() {//передвигаем ИИ
	    for(let ball of balls) {
	        let min = food[0];
	        let minRast = min.getRast(min, ball);
	        for(let _food of food) {
	            if(_food.getRast(_food, ball) < minRast) {
	                min = _food;
	                minRast = min.getRast(min, ball);
	            }
	        }
	        for(let _ball of balls) {
	            if(_ball.getRast(_ball, ball) < minRast && _ball !== ball) {
	                min = _ball;
	                minRast = min.getRast(min, ball);
                }
	        }
	        if(player) {
	            if(player.getRast(player, ball) < minRast && player.getRadius() < ball.getRadius()) {
	                min = player;
	            }
            }
	        setMoveAI(min, ball);
	        ball.moveAI();
	        eatAI(min, ball);
	    }
    }

	function init() {
        pushFood();
        pushBalls();
	}

	this.resetScore = () => { score = 0; };

    this.changeColor = color => { player.color = color; };

    this.changeNickname = name => { player.name = name; };

    this.direction = (x, y) => {//устанавливаем направление движения игрока
        if (player) {
            const dx = getX(x) - player.center().x;
            const dy = getY(y) - player.center().y;
            player.setDirection(dx, dy);
        }
    };

    this.getScore = () => { return score; };

    this.refresh = () => {
        if(player) {
            move();
            eat();
            moveAI();
            return true;
        }
        init();
        player = createNewPlayer();
        return false;
    };

    this.render = cb => {
        printFood(cb);
        printBalls(cb);
    };

    init();
}