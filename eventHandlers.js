if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    canvas.addEventListener('touchstart', evt => {
        event.preventDefault();
        const touches = evt.changedTouches;
        isDrawing = !isAlive ? true : false;
        !isAlive && touches && drawAtLocation(touches[0].pageX, touches[0].pageY);
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });

    canvas.addEventListener('touchmove', evt => {
        evt.preventDefault();
        const touches = evt.changedTouches;
        isDrawing && touches && drawAtLocation(touches[0].pageX, touches[0].pageY);
    });
} else {
    canvas.addEventListener('mousedown', (event) => {
        event.preventDefault();
        isDrawing = !isAlive ? true : false;
        !isAlive && drawAtLocation(event.pageX, event.pageY);
    });
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mousemove', (event) => {
        event.preventDefault();
        isDrawing && drawAtLocation(event.pageX, event.pageY);
    });
}