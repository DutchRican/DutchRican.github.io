const canvas = document.getElementById("game");
const startButton = document.getElementById("startButton");
const counter = document.getElementById("counter");
const generation = document.getElementById("generation");
const highscore = document.getElementById("highscore");
const colorSetting = document.getElementById("colorSetting");
const speedSetting = document.getElementById("speedSetting");
const informationModal = document.getElementById("informationModal");
const patternSelector = document.getElementById("patternSelector");
const ctx = canvas.getContext("2d");

const ROWS = 80;
const COLS = 60;
const DEAD = "white";
let ALIVE = "black";
const SIZE = 8;
let SPEED = 125;
let isAlive = false;
let isDrawing = false;
let highestScore = 0;
let currentCount = 0;
let generationCount = 0;

let gameField;

function createFreshBoard() {
  return new Array(ROWS)
    .fill(null)
    .map(() => new Array(COLS).fill(null).map(() => ({ isAlive: false })));
}

function getHighScore() {
  const hscore = localStorage.getItem("highscore");
  highestScore = hscore ? parseInt(hscore, 10) : highestScore;
  highscore.textContent = highestScore;
}

function setHighScore(val) {
  localStorage.setItem("highscore", val);
}

function drawSquare(location, color) {
  ctx.fillStyle = color;
  ctx.fillRect(location.x * SIZE, location.y * SIZE, SIZE, SIZE);
  ctx.strokeStyle = "#949090";
  ctx.strokeRect(location.x * SIZE, location.y * SIZE, SIZE, SIZE);
}

function setColor() {
  ALIVE = colorSetting.value;
}

function setSpeed() {
  SPEED = 1000 - speedSetting.value * 9;
}

function openModal() {
  document.body.className = "modal-open";
  informationModal.classList.toggle("show", true);
}

function startGame() {
  isAlive = !isAlive;
  if (!isAlive) {
    gameField = createFreshBoard();
    drawBoard();
    generationCount = 0;
    counter.textContent = 0;
    generation.textContent = 0;
  }
  setButtonTextAndColor();
  gameLoop();
}

function setButtonTextAndColor() {
  startButton.textContent = isAlive ? "Stop Game" : "Start Game";
  startButton.classList.toggle("btn-outline-primary", !isAlive);
  startButton.classList.toggle("btn-outline-danger", isAlive);
}

function getRelativeLocation(x, y, element, xFactor, yFactor) {
  let relX = Math.floor((x - element.offsetLeft) / xFactor);
  let relY = Math.floor((y - element.offsetTop) / yFactor);
  return { x: relX, y: relY };
}

function drawAtLocation(x, y, isTranslated = false) {
  const location = isTranslated
    ? { x, y }
    : getRelativeLocation(x, y, canvas, SIZE, SIZE);
  gameField[location.x][location.y] = { isAlive: true };
  drawSquare(location, ALIVE);
}

function setLifeCount() {
  if (currentCount > highestScore) {
    highestScore = currentCount;
    highscore.textContent = highestScore;
    setHighScore(highestScore);
  }
  counter.textContent = currentCount;
  if (!currentCount) {
    startButton.textContent = "Start Game";
    generationCount = -1;
    isAlive = false;
    setButtonTextAndColor();
  }
}

function updateGeneration() {
  generationCount++;
  generation.textContent = generationCount;
}

function drawBoard() {
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      drawSquare({ x, y }, gameField[x][y].isAlive ? ALIVE : DEAD);
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
      if (gameField[block.x + x][block.y + y].isAlive) {
        neighbors += 1;
      }
    }
  }
  return neighbors;
}

function updateNeighborCount() {
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      gameField[x][y].neighbors = getNeighbors({ x, y });
    }
  }
}

function updateBoard() {
  let liveCount = 0;
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      const count = gameField[x][y].neighbors;
      if (count > 3 || count < 2) {
        gameField[x][y].isAlive = false;
      } else if (count === 3) {
        gameField[x][y].isAlive = true;
      }
      if (gameField[x][y].isAlive) liveCount++;
    }
  }
  currentCount = liveCount;
}
gameField = createFreshBoard();
drawBoard();
getHighScore();
setSpeed();

let loopTimer = Date.now();
function gameLoop() {
  let now = Date.now();
  let delta = now - loopTimer;
  if (delta > SPEED) {
    updateNeighborCount();
    updateBoard();
    drawBoard();
    setLifeCount();
    updateGeneration();
    loopTimer = Date.now();
  }
  isAlive && requestAnimationFrame(gameLoop);
}
