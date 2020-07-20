const shapes = {
    "clear": { data: [], height: 0, width: 0 },
    "circle": { data: [[3, 0], [2, 1], [4, 1], [1, 2], [5, 2], [1, 3], [5, 3], [2, 4], [4, 4], [3, 5]], height: 6, width: 5 },
    "glider": { data: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 2]], height: 3, width: 3 },
    "light space ship": { data: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]], height: 4, width: 5 },
    "f-pentomino": { data: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], height: 3, width: 3 },
    "acorn": { data: [[1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]], height: 3, width: 7 },
    "square": { data: [[0, 0], [2, 0], [4, 0], [0, 1], [4, 1],[0, 2], [4, 2],[0, 3], [4, 3], [0, 4], [2, 4], [4, 4]], height: 5, width: 5 },
    "10 col": { data: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],], height: 1, width: 10 },
    "10 row": { data: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],], height: 1, width: 10 },
};

// filling the select
Object.keys(shapes).forEach(pattern => $(patternSelector).append(`<option value="${pattern}">${pattern}</option`))

function selectingPattern() {
    gameField = createFreshBoard();
    drawBoard();
    const pattern = shapes[patternSelector.value];
    const offSetX = Math.floor((ROWS - pattern.width) / 2);
    const offSetY = Math.floor((COLS - pattern.height) / 2);
    pattern.data.forEach(cell => drawAtLocation(cell[0] + offSetX, cell[1] + offSetY, true));
}