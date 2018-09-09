function Graph(options) {
    options = (options instanceof Object) ? options : {};

    const canvas = $('.canvas')[0];
    const context = canvas.getContext('2d');
    const MEDIATOR_EVENTS = options.MEDIATOR_EVENTS;
    const mediator = options.mediator;
    let memCanvas = null;
    let memContext = null;

    const img = new Image();
    img.src = "../game/static/game/img/food_sample.png";
    const background = new Image();
    background.src = "../game/static/game/img/field.png";

    const koef1 = Math.cos(3 * Math.PI / 4) * 1.2;
    const koef2 = -Math.sin(3 * Math.PI / 4) * 1.45;

    function getRadius(r) {
        return (r * (canvas.height / 10 + canvas.width / 10)) / 2;
        
    }

	function getFont(r) {
	    return `${getRadius(r)}px Arial`;
    }

    function fillRect() {
        memContext.drawImage(background, 0, 0);
    }

    function circle(options) {
        const koord = options.koord;
        const r = options.r;
        const color = options.color;
        memContext.beginPath();
        memContext.strokeStyle = (color) ? color : 'black';
        memContext.arc(koord.x, koord.y, getRadius(r), 0, 2 * Math.PI, true);
        memContext.stroke();
        memContext.fillStyle = (color) ? color : 'black';
        memContext.fill();
    }

    function printText(options) {
        const koord = options.koord;
        const r = options.r;
        const text = options.text;
        memContext.fillStyle = 'white';
        memContext.textAlign = 'center';
        memContext.textBaseline = 'center';
        memContext.font = getFont(r / 2);
        memContext.fillText(text, koord.x, koord.y + 2);
    }

    function sprite(options) {
        const settings = options.img;
        const r = options.radius;
        const koord = options.koord;
        const radius = getRadius(r);
        const size = radius * 2;
        const x = koef1 * radius + koord.x;
        const y = koef2 * radius + koord.y;
        memContext.drawImage(img, settings.x, settings.y, settings.xs, settings.ys, x, y, size, size);
    }

    this.fillRender = () => { context.drawImage(memCanvas, 0, 0); };

    function init() {
        canvas.width = options.width;
        canvas.height = options.height;
        // виртуальный канвас
        memCanvas = document.createElement('canvas');
        memCanvas.width = options.width;
        memCanvas.height = options.height;
        memContext = memCanvas.getContext('2d');
        mediator.subscribe(MEDIATOR_EVENTS.GET_CANVAS,  () => { return canvas; });
        mediator.subscribe(MEDIATOR_EVENTS.FILL_RENDER, () => { context.drawImage(memCanvas, 0, 0); });
        mediator.subscribe(MEDIATOR_EVENTS.SPRITE, sprite);
        mediator.subscribe(MEDIATOR_EVENTS.PRINT_TEXT, printText);
        mediator.subscribe(MEDIATOR_EVENTS.CIRCLE, circle);
        mediator.subscribe(MEDIATOR_EVENTS.FILL_RECT, fillRect);
    }
    init();
}