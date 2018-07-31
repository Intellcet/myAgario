function Graph(options) {

    const canvas = $('.canvas')[0];
    const context = canvas.getContext('2d');
    let memCanvas = null;
    let memContext = null;

    const img = new Image();
    img.src = "img/food.png";

    const koef1 = Math.cos(3 * Math.PI / 4) * 1.2;
    const koef2 = -Math.sin(3 * Math.PI / 4) * 1.45;

    function getRadius(r) {
        return (r * (canvas.height / 10 + canvas.width / 10)) / 2;
        
    }

	function getFont(r) {
	    return `${getRadius(r)}px Arial`;
    }

    this.fillRect = color => {
        memContext.fillStyle = color;
        memContext.fillRect(0, 0, memCanvas.width, memCanvas.height);
    };

    this.circle = (koord, r, color) => {
        memContext.beginPath();
        memContext.strokeStyle = (color) ? color : 'black';
        memContext.arc(koord.x, koord.y, getRadius(r), 0, 2 * Math.PI, true);
        memContext.stroke();
        memContext.fillStyle = (color) ? color : 'black';
        memContext.fill();
    };

    this.printText = (text, koord, r) => {
        memContext.fillStyle = 'white';
        memContext.textAlign = 'center';
        memContext.textBaseline = 'center';
        memContext.font = getFont(r / 2);
        memContext.fillText(text, koord.x, koord.y + 2);
    };

    this.getCanvas = () => { return canvas; };

    this.sprite = (settings, koord, r) => {
        const radius = getRadius(r);
        const size = radius * 2;
        const x = koef1 * radius + koord.x;
        const y = koef2 * radius + koord.y;
        memContext.drawImage(img, settings.x, settings.y, settings.xs, settings.ys, x, y, size, size);
    };

    this.fillRender = () => { context.drawImage(memCanvas, 0, 0); };

    function init() {
        canvas.width = options.width;
        canvas.height = options.height;
        // виртуальный канвас
        memCanvas = document.createElement('canvas');
        memCanvas.width = options.width;
        memCanvas.height = options.height;
        memContext = memCanvas.getContext('2d');
    }
    init();
}