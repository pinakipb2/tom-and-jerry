import { setupGround, updateGround } from './ground.js';
import { setupJerry, updateJerry, setJerryLose } from './jerry.js';
import { setupTom, updateTom, getTomRect, setTomLose } from './tom.js';
import { setupSpike, updateSpike, getSpikeRects } from './spike.js';
import { setCustomProperty } from './updateCustomProperty.js';

const SPEED_SCALE_INCREASE = 0.00003;

const scoreElem = document.querySelector('[data-score]');
const maxScoreElem = document.querySelector('[data-maxscore]');
const startScreenElem = document.querySelector('[data-start-screen]');

const maxScore = localStorage.getItem('maxScore') || 0;
maxScoreElem.textContent = `| Max: ${maxScore}`;

document.addEventListener('keyup', handleStart, { once: true });

console.log('%cCreated by Pinaki Bhattacharjee (@pinakipb2)', 'background: red; color: yellow; font-size: x-large');

let lastTime;
let speedScale;
let score;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;
  updateGround(delta, speedScale);
  updateTom(delta, speedScale);
  updateJerry(delta, speedScale);
  updateSpike(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();
  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const tomRect = getTomRect();
  return getSpikeRects().some((rect) => isCollision(rect, tomRect));
}

function isCollision(rect1, rect2) {
  const factor = 125;
  return rect1.left + factor < rect2.right && rect1.top + factor < rect2.bottom && rect1.right > rect2.left + factor && rect1.bottom > rect2.top + factor;
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = `Score: ${Math.floor(score)}`;
}

function handleStart(e) {
  if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupTom();
    setupJerry();
    setupSpike();
    const run = new Audio('audios/run.mp3');
    run.play();
    startScreenElem.classList.add('hidden');
    window.requestAnimationFrame(update);
  }
}

function handleLose() {
  const KO = new Audio('audios/game-over.mp3');
  KO.play();
  const currentMax = localStorage.getItem('maxScore') || 0;
  const mx = Math.max(currentMax, Math.floor(score));
  localStorage.setItem('maxScore', mx);
  maxScoreElem.textContent = `| Max: ${mx}`;
  const tomElem = document.querySelector('[data-tom]');
  setCustomProperty(tomElem, '--bottom', 20);
  setTomLose();
  setJerryLose();
  setTimeout(() => {
    document.addEventListener('keydown', handleStart, { once: true });
    startScreenElem.classList.remove('hidden');
  }, 100);
}
