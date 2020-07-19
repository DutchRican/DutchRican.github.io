const canvas = document.getElementById('game');
const startButton = document.getElementById('startButton');
const counter = document.getElementById('counter');
const highscore = document.getElementById('highscore');
const colorSetting = document.getElementById('colorSetting');
const speedSetting = document.getElementById('speedSetting');
const informationModal = document.getElementById('informationModal');

const ctx = canvas.getContext('2d');

const ROWS = 80;
const COLS = 60;
const DEAD = 'white';
let ALIVE = 'black';
const SIZE = 8;
let SPEED = 125;
let isAlive = false;
let isDrawing = false;
let highestScore = 0;

let gameField = createFreshBoard();

function createFreshBoard() {
    return new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null).map(() => ({ alive: false })));
}

function getHighScore() {
    const hscore = localStorage.getItem('highscore');
    highestScore = hscore ? parseInt(hscore, 10) : highestScore;
    highscore.textContent = highestScore;
}

function setHighScore(val) {
    localStorage.setItem('highscore', val);
}

function drawSquare(location, color) {
    ctx.fillStyle = color;
    ctx.fillRect(location.x * SIZE, location.y * SIZE, SIZE, SIZE);
    ctx.strokeStyle = '#949090';
    ctx.strokeRect(location.x * SIZE, location.y * SIZE, SIZE, SIZE);
}

function setColor() {
    ALIVE = colorSetting.value;
}

function setSpeed() {
    SPEED = 1000 - (speedSetting.value * 8.25);
}

function openModal() {
    document.body.className = "modal-open";
    informationModal.classList.toggle('show', true);
}

function startGame() {
    isAlive = !isAlive;
    if (!isAlive) {
        gameField = createFreshBoard();
        drawBoard();
        counter.textContent = 0;
    }
    setButtonTextAndColor();
    gameLoop();
};

function setButtonTextAndColor() {
    startButton.textContent = isAlive ? "Stop Game" : "Start Game";
    startButton.classList.toggle('btn-outline-primary', !isAlive);
    startButton.classList.toggle('btn-outline-danger', isAlive);
}

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

function getRelativeLocation(x, y, element, xFactor, yFactor) {
    let relX = Math.floor((x - element.offsetLeft) / xFactor);
    let relY = Math.floor((y - element.offsetTop) / yFactor);
    return { x: relX, y: relY };
}

function drawAtLocation(x, y) {

    const location = getRelativeLocation(x, y, canvas, SIZE, SIZE);
    gameField[location.x][location.y] = { alive: true };
    drawSquare(location, ALIVE);
}

function getLifeCount() {
    let count = 0;
    gameField.forEach((row) => row.forEach((col) => {
        if (col.alive) count++;
    }));
    if (count > highestScore) {
        highestScore = count;
        highscore.textContent = highestScore;
        setHighScore(highestScore);
    }
    counter.textContent = count;
    if (!count) {
        startButton.textContent = "Start Game";
        isAlive = false;
        setButtonTextAndColor();
    }
}

function drawBoard() {
    for (let x = 0; x < ROWS; x++) {
        for (let y = 0; y < COLS; y++) {
            drawSquare({ x, y }, gameField[x][y].alive ? ALIVE : DEAD);
        }
    }
}

function getNeighbors(block) {
    // neighbors 0, 0 is us
    // -1, 1  0, 1  1, 1
    // -1, 0  0, 0  1, 0
    // -1,-1  0,-1  1,-1
    let neighbors = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            if (block.x + x < 0 || block.x + x >= gameField.length) continue;
            if (block.y + y < 0 || block.y + y >= gameField[0].length) continue;
            if (gameField[block.x + x][block.y + y].alive) {
                neighbors += 1;
            }
        }
    }
    return neighbors;
}

function updateLives() {
    let tempField = createFreshBoard();
    for (let x = 0; x < ROWS; x++) {
        for (let y = 0; y < COLS; y++) {
            let lifeNeighbors = getNeighbors({ x, y });
            if (gameField[x][y].alive && (lifeNeighbors > 3 || lifeNeighbors < 2)) {
                tempField[x][y].alive = false;
            } else if (!gameField[x][y].alive && lifeNeighbors === 3) {
                tempField[x][y].alive = true;
            } else {
                tempField[x][y].alive = gameField[x][y].alive;
            }
        }
    }
    return tempField;
}

drawBoard();
getHighScore();

let loopTimer = Date.now();
function gameLoop() {
    let now = Date.now();
    let delta = now - loopTimer;
    if (delta > SPEED) {
        gameField = updateLives();
        drawBoard();
        getLifeCount();
        loopTimer = Date.now();
    }
    isAlive && requestAnimationFrame(gameLoop);
}
