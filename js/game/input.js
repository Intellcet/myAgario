function Input(options) {
    
    var move = options.move;
    var canvas = options.canvas;


    canvas.addEventListener('mousemove', function (event) {
        move(event.offsetX, event.offsetY);
    });

}