const board = document.getElementById('gameBoard');
const moodColor = document.getElementById('moodColor');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');

const size = 10;
const player = { x: 0, y: 0 };
const moods = ['blue', 'yellow', 'red', 'purple'];
let currentMood = 'blue';
let timer = 10;
let interval;
let grid = [];

function createMaze() {
  grid = [];
  board.innerHTML = '';
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const rand = Math.random();
      let pathClass = '';
      if (rand < 0.25) pathClass = 'path-blue';
      else if (rand < 0.5) pathClass = 'path-yellow';
      else if (rand < 0.75) pathClass = 'path-red';
      else pathClass = 'path-purple';
      cell.classList.add(pathClass);
      board.appendChild(cell);
      row.push({ el: cell, mood: pathClass.split('-')[1] });
    }
    grid.push(row);
  }
}

function updatePlayer() {
  grid.forEach(row => row.forEach(cell => cell.el.classList.remove('player')));
  grid[player.y][player.x].el.classList.add('player');
}

function updateVisibility() {
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.mood !== currentMood) {
        cell.el.classList.add('hidden');
      } else {
        cell.el.classList.remove('hidden');
      }
    });
  });
  moodColor.textContent = currentMood.charAt(0).toUpperCase() + currentMood.slice(1);
}

function switchMood() {
  const index = moods.indexOf(currentMood);
  currentMood = moods[(index + 1) % moods.length];
  updateVisibility();
}

function startTimer() {
  clearInterval(interval);
  timer = 10;
  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      switchMood();
      timer = 10;
    }
  }, 1000);
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
    if (grid[ny][nx].mood === currentMood) {
      player.x = nx;
      player.y = ny;
      updatePlayer();
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  else if (e.key === 'ArrowDown') movePlayer(0, 1);
  else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  else if (e.key === 'ArrowRight') movePlayer(1, 0);
});

restartBtn.addEventListener('click', () => {
  player.x = 0;
  player.y = 0;
  createMaze();
  updatePlayer();
  updateVisibility();
  startTimer();
});

createMaze();
updatePlayer();
updateVisibility();
startTimer();
