const STRUCT = {};

STRUCT.Circle = function(x, y, mass, color, id) {

    this.x = x;
    this.y = y;
    this.mass = mass;
    this.id = id;
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

    this.radius = this.getRadius();
};

STRUCT.Ball = function(_x, _y, _mass, _color, _name, _id) {

    STRUCT.Circle.call(this, _x, _y, _mass, _color, _id);

    let dx = 0;
    let dy = 0;

    this.name = _name;

    this.score = 0;

    this.canvas = {
        width: 0,
        height: 0
    };

    this.scene = {
        food: [],
        balls: [],
    };

    this.frame = {
        width: 10,
        height: 10,
        left: 0,
        bottom: 0
    };

    this.local = {
        x: 0,
        y: 0
    };

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

    this.move = (screen) => {
        const speed = this.getSpeed();
        if(this.x <= screen.left + screen.width && this.x >= screen.left) {
            this.x += speed * this.getDirection().dx;
            this.frame.left += speed * this.getDirection().dx;
        }
        if(this.x > screen.left + screen.width) {
            if(this.getDirection().dx > 0) {
                this.getDirection().dx = 0;
            }
            else {
                this.x += speed * this.getDirection().dx;
                this.frame.left += speed * this.getDirection().dx;
            }
        }
        if(this.x < screen.left) {
            if(this.getDirection().dx < 0) {
                this.getDirection().dx = 0;
            }
            else {
                this.x += speed * this.getDirection().dx;
                this.frame.left += speed * this.getDirection().dx;
            }
        }
        if(this.y <= screen.bottom + screen.height && this.y >= screen.bottom) {
            this.y += speed * this.getDirection().dy;
            this.frame.bottom += speed * this.getDirection().dy;
        }
        if(this.y > screen.bottom + screen.height) {
            if(this.getDirection().dy > 0) {
                this.getDirection().dy = 0;
            } else {
                this.y += speed * this.getDirection().dy;
                this.frame.bottom += speed * this.getDirection().dy;
            }
        }
        if(this.y < screen.bottom) {
            if(this.getDirection().dy < 0) {
                this.getDirection().dy = 0;
            } else {
                this.y += speed * this.getDirection().dy;
                this.frame.bottom += speed * this.getDirection().dy;
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
};

STRUCT.Food = function(_x, _y, _mass) {

    STRUCT.Circle.call(this, _x, _y, _mass);

    this.getRast = (food, ball) => {
        const x = food.center().x - ball.center().x;
        const y = food.center().y - ball.center().y;
        return Math.sqrt(x * x + y * y);
    };
    this.roll = Math.floor(Math.random() * 5 + 1);
};

STRUCT.Field = function (width, height, left, bottom) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.bottom = bottom;
};

module.exports = STRUCT;