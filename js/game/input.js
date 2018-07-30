function Input(options) {
    
    const move = options.move;
    const canvas = options.canvas;

    $(canvas).on('mousemove', event =>{
        move(event.originalEvent.offsetX, event.originalEvent.offsetY);
    });
}