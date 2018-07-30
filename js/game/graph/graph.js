function Graph(options) {

    var canvas = null;
    var context = null;
    var memCanvas = null;
    var memContext = null;
    var div = null;

    var koef1 = Math.cos(3 * Math.PI / 4) * 1.2;
    var koef2 = -Math.sin(3 * Math.PI / 4) * 1.45;

    function getRadius(r) {
        var r1 = r * canvas.height / 10;
        var r2 = r * canvas.width / 10;
        return (r1 + r2) / 2;
        
    }

	function getFont(r) {
	    return getRadius(r) + "px Arial";
    }

    this.fillRect = function (color) {
        memContext.fillStyle = color;
        memContext.fillRect(0, 0, memCanvas.width, memCanvas.height);
    };

    this.circle = function (koord, r, color) {
        memContext.beginPath();
        memContext.strokeStyle = (color) ? color : 'black';
        memContext.arc(koord.x, koord.y, getRadius(r), 0, 2 * Math.PI, true);
        memContext.stroke();
        memContext.fillStyle = (color) ? color : 'black';
        memContext.fill();
    };

    this.printText = function (text, koord, r) {
        memContext.fillStyle = 'white';
        memContext.textAlign = 'center';
        memContext.textBaseline = 'center';
        memContext.font = getFont(r / 2);
        memContext.fillText(text, koord.x, koord.y + 2);
    };

    this.getCanvas = function () {
        return canvas;
    };

    this.sprite = function (img, settings, koord, r) {
        var radius = getRadius(r);
        var size = radius * 2;
        var x = koef1 * radius + koord.x;
        var y = koef2 * radius + koord.y;
        memContext.drawImage(img, settings.x, settings.y, settings.xs, settings.ys, x, y, size, size);
    };

    this.fillRender = function () {
        context.drawImage(memCanvas, 0, 0);
    };

    function init() {
        // канвас в ДОМ-е
        canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        document.querySelector('body').appendChild(canvas);
        context = canvas.getContext('2d');
        // виртуальный канвас
        memCanvas = document.createElement('canvas');
        memCanvas.width = options.width;
        memCanvas.height = options.height;
        memContext = memCanvas.getContext('2d');
		// создал блок
		div = document.createElement('div');
		div.setAttribute('style', 'float:left');
		div.appendChild(canvas);
		document.querySelector('body').appendChild(div);
    }
    init();
}