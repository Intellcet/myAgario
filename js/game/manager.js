function Manager(_width, _height) {

    var width  = _width  || 600;
    var height = _height || 600;
    
    var img = new Image();
    img.src = "img/223.png";
    
    var data  = new Data ({ width: width, height: height });
    var graph = new Graph({ width: width, height: height, data: data });
    new Input({
        canvas: graph.getCanvas(),
        move: function (dx, dy) {
            data.direction(dx, dy);
        }
    });

    function render() {
        if(data.refresh() === true) {
            graph.fillRect('#00CED1');
            data.render(function (koord, r, color, text, settings) {
                if (!text) {
                    graph.sprite(img, settings, koord, r);
                    //graph.circle(koord, r, color);
                } else {
                    graph.circle(koord, r, color);
                    graph.printText(text, koord, r);
                }
            });
            graph.fillRender();
        } else {
            return true;
        }
    }

    this.changeNick = function (nickname) {
        data.changeNickname(nickname);
    };

    this.changeColor = function (color) {
        if (color === 'красный') { color = 'red'; }
        if (color === 'синий' || color === 'голубой') { color = 'blue'; }
        if (color === 'желтый') { color = 'yellow'; }
        if (color === 'зеленый') { color = 'green'; }
        data.changeColor(color);
    };

    this.getScore = function () {
        return data.getScore();
    };

    this.play = function () {
        return render();
    };
}