function Manager(_width, _height) {

    let width  = _width  || 600;
    let height = _height || 600;
    
    const img = new Image();
    img.src = "img/223.png";

    const FILL_RECT_COLOR = '#00CED1';
    
    const data  = new Data ({ width, height });
    const graph = new Graph({ width, height, data });

    new Input({
        canvas: graph.getCanvas(),
        move: (dx, dy) => { data.direction(dx, dy); }
    });

    function render() {
        if(data.refresh() === true) {
            graph.fillRect(FILL_RECT_COLOR);
            data.render((koord, r, color, text, settings) => {
                if (!text) {
                    graph.sprite(img, settings, koord, r);
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

    this.changeNick = nickname => {
        data.changeNickname(nickname);
    };

    this.changeColor = color => {
        color = color.toLowerCase();
        switch (color) {
            case 'красный':
                color = 'red';
                break;
            case 'синий':
                color = 'blue';
                break;
            case 'голубой':
                color = 'lightblue';
                break;
            case 'желтый':
                color = 'yellow';
                break;
            case 'зеленый':
                color = 'green';
                break;
        }
        data.changeColor(color);
    };

    this.resetScore = () => { data.resetScore(); };

    this.getScore = () => {
        return data.getScore();
    };

    this.play = () => {
        return render();
    };
}