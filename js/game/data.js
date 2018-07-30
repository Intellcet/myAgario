function Circle(x, y, mass, color) {

    this.x = x;
    this.y = y;
    this.mass = mass;
    this.color = (color) ? color : "rgb(" + Math.floor(Math.random() * 256) +", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";


    this.center = function () {
        return { x: this.x, y: this.y };
    };

    this.getMass = function () {
        return this.mass
    };

    this.getColor = function () {
        return this.color;
    };

    this.getRadius = function () {
        return Math.sqrt(this.mass / Math.PI);
    };
}

function Ball(_x, _y, _mass, _color, _name) {

    Circle.call(this, _x, _y, _mass, _color);

    var dx = 0;
    var dy = 0;

    this.name = _name;

    this.getName = function () {
        return this.name
    };

    this.getDirection = function () {
        return { dx: dx, dy: dy };
    };

    this.setDirection = function (_dx, _dy) {
        dx = _dx;
        dy = _dy;
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(d > 1) {
            dx = dx / d;
            dy = dy / d;
        }
        return {
            dx: dx,
            dy: dy
        };
    };
	

    this.getSpeed = function () {
        return 1 / (10 * Math.pow(this.mass, 1 / 7));
    };

    this.move = function (frame, screen) {
        var speed = this.getSpeed();
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

    this.eat = function (_mass) {
        this.mass += _mass;
    };

    this.getRast = function (player, ball) {
        var x = player.center().x - ball.center().x;
        var y = player.center().y - ball.center().y;
        return Math.sqrt(x * x + y * y);
    };

    this.moveAI = function () {// для ИИ
        var speed = this.getSpeed();
        this.x += speed * this.getDirection().dx;
        this.y += speed * this.getDirection().dy;
    };
	


}

function Food(_x, _y, _mass) {

    Circle.call(this, _x, _y, _mass);

    this.getRast = function (eda, ball) {
        var x = eda.center().x - ball.center().x;
        var y = eda.center().y - ball.center().y;
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

    var Height = options.height;
    Width = options.width;

    var screen = new Field(100, 100, -50, -50);
    var frame = new Field(10, 10, -5, -5);

    var food = []; //массив со всей едой
    var balls = [];//массив всех шаров

    var score = 0;

    var nicks = new GenerateNicks();

    var player = new Ball(
            (frame.width + frame.left + frame.left) / 2,
            (frame.height + frame.bottom + frame.bottom) / 2,
            0.1,
            undefined,
            '213'
        );

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
        for (var i = 0; i < 2500; i++) {
            food.push(new Food(
                Math.random() * screen.width + screen.left,
                Math.random() * screen.height + screen.bottom,
                10 / (frame.width * frame.height)
            ));
        }
    }

    function pushBalls() {//заполняем шары
        for (var i = 0; i < 7; i++){
            balls.push(new Ball(
				Math.random() * screen.width + screen.left,
                Math.random() * screen.height + screen.bottom,
				0.1,
				"rgb(" + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ")",
                nicks.genNick()
			));
        }
    }

    function rollFood(eda) {
        if (eda.roll === 1) {   eda.img = { x: 20,  y: 77,  xs: 104, ys: 109 };   }
        if (eda.roll === 2) {   eda.img = { x: 156, y: 76,  xs: 85,  ys: 119 };   }
        if (eda.roll === 3) {   eda.img = { x: 260, y: 75,  xs: 129, ys: 117 };   }
        if (eda.roll === 4) {   eda.img = { x: 24,  y: 206, xs: 97,  ys: 117 };   }
        if (eda.roll === 5) {   eda.img = { x: 137, y: 205, xs: 123, ys: 120 };   }
    }

    function printFood(cb) {//рисуем еду
        var fw_fl = frame.width + frame.left;
        var fh_fb = frame.height + frame.bottom;
        for (var i = 0; i < food.length; i++) {
            rollFood(food[i]);
            var center = food[i].center();
            var radius = food[i].getRadius();
            if(center.x + radius > frame.left &&
               center.x - radius < fw_fl &&
               center.y + radius > frame.bottom &&
               center.y - radius < fh_fb) {
                cb({ x: getXs(center.x), y: getYs(center.y) }, radius, food[i].getColor(), null, food[i].img);
            }
        }
    }

    function printBalls(cb) {//рисуем шары
        var fw_fl = frame.width + frame.left;
        var fh_fb = frame.height + frame.bottom;
        for(var i = 0; i < balls.length; i++) {
            var center = balls[i].center();
            var radius = balls[i].getRadius();
            if(center.x + radius > frame.left &&
               center.x - radius < fw_fl &&
               center.y + radius > frame.bottom &&
               center.y - radius < fh_fb) {
                cb({ x: getXs(center.x), y: getYs(center.y) }, radius, balls[i].getColor(), balls[i].getName());
            }
        }
        if(player) {
            cb({ x: getXs(player.center().x), y: getYs(player.center().y) }, player.getRadius(), player.getColor(), player.getName());
        }
    }

    function zoomFrame() { //отдаляет экран(полная хрень... ошибка в изменении длины/ширины/левого нижнего угла)
        if(frame.width / player.getRadius() < 27 && frame.height / player.getRadius() < 27) {
            frame.width += 0.05;
            frame.height += 0.05;
            frame.bottom -= 0.025;
            frame.left -= 0.025;
            for (var i = 0; i < food.length; i++) {
                food[i].mass = 10 / (frame.width * frame.height);
            }
        }
    }

    function eat() {//едим
        var radius = player.getRadius();
        var radiusFood = food[0].getRadius();
        for(var j = 0; j < food.length; j++) {
            if(food[j].getRast(food[j], player) < radius) {
                var mass = food[j].getMass() / player.getMass() * 0.05;
	            player.eat(mass);
	            score++;
				food.splice(j, 1);
				food.push(new Food(
					Math.random() * screen.width + screen.left,
                    Math.random() * screen.width + screen.bottom,
					10 / (frame.width * frame.height)
				));
			}
	    }
	    for (var i = 0; i < balls.length; i++) {
	        if(balls[i].getRast(balls[i], player) < radius && radius > balls[i].getRadius()) {
	            var mass = balls[i].getMass() / player.getMass() * 0.05;
	            player.eat(mass);
	            score++;
	            balls.splice(i, 1);
	            balls.push(new Ball(
					Math.random() * screen.width + screen.left,
					Math.random() * screen.height + screen.bottom,
					0.1,
                    "rgb(" + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ")",
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
		var dx = food.center().x - ball.center().x;
		var dy = food.center().y - ball.center().y;
		ball.getDirection().dx = ball.setDirection(dx, dy).dx;
		ball.getDirection().dy = ball.setDirection(dx, dy).dy;
	}

	function eatAI(min, ball) {
	    var radiusBall = ball.getRadius();
	    var minRast = min.getRast(min, ball);
	    for(var i = 0; i < balls.length; i++) {
	        if(min === balls[i]) {
	            if(minRast < radiusBall) {
	                var mass = min.getMass / ball.getMass() * 0.05;
	                ball.eat(mass);
	                balls.splice(i, 1);
	                balls.push(new Ball(
                        Math.random() * screen.width + screen.left,
                        Math.random() * screen.height + screen.bottom,
                        0.1,
                        "rgb(" + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ")",
                        nicks.genNick()
                    ));
	            }
	            break;
	        }
	    }
	    for (var i = 0; i < food.length; i++) {
	        if (min === food[i]) {
	            if (minRast < radiusBall) {
	                var mass = min.getMass() / ball.getMass() * 0.05;
	                ball.eat(mass);
	                food.splice(i, 1);
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
	            var mass = player.getMass() / ball.getMass() * 0.05;
	            ball.eat(mass);
	            player = null;
	        }
	    }
    }

	function moveAI() {//передвигаем ИИ
	    for(var i = 0; i < balls.length; i++) {
	        var ball = balls[i];
	        var min = food[0];
	        var minRast = min.getRast(min, ball);
	        for(var j = 1; j < food.length; j++) {
	            if(food[j].getRast(food[j], ball) < minRast) {
	                min = food[j];
	                minRast = min.getRast(min, ball);
	            }
	        }
	        for(var s = 0; s < balls.length; s++) {
	            if(balls[s].getRast(balls[s], ball) < minRast && balls[s] != ball) {
	                min = balls[s];
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

    this.changeColor = function (color) {
        player.color = color;
    };

    this.changeNickname = function (name) {
        player.name = name;
    };

    this.direction = function (x, y) {//устанавливаем направление движения игрока
        if (player) {
            var dx = getX(x) - player.center().x;
            var dy = getY(y) - player.center().y;
            player.setDirection(dx, dy);
        }
        
    };

    this.getScore = function () {
        return score;
    };

    this.refresh = function () {
        if(player) {
            move();
            eat();
            moveAI();
            return true;
        }
        return false;
    };

    this.render = function (cb) {
        printFood(cb);
        printBalls(cb);
    };

    this.getFrame = function () {
        return frame;
    };
    this.getFood = function () {
        return food;
    };
    this.getBalls = function () {
        return balls;
    };
    this.getPlayer = function () {
        return player;
    };

    init();
}