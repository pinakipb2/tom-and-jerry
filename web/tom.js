import { getCustomProperty, setCustomProperty, incrementCustomProperty } from './updateCustomProperty.js';

const tomElem = document.querySelector('[data-tom]');

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const TOM_FRAME_COUNT = 2; //Number of tom images to make it moving
const FRAME_TIME = 35;

let isJumping;
let tomFrame;
let currentFrameTime;
let yVelocity;
export function setupTom() {
  isJumping = false;
  tomFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(tomElem, '--bottom', 18);
  document.removeEventListener('keydown', onJump);
  document.addEventListener('keydown', onJump);
}

export function updateTom(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getTomRect() {
  return tomElem.getBoundingClientRect();
}

export function setTomLose() {
  tomElem.src = 'imgs/tom-lose.png';
}

let playingJump = false;

function handleRun(delta, speedScale) {
  const jumpAudio = new Audio('audios/jump.mp3'); // buffers automatically when created
  if (isJumping) {
    if (!playingJump) {
      jumpAudio.play();
      playingJump = true;
      jumpAudio.addEventListener('ended', () => {
        playingJump = false;
      });
    }
    tomElem.src = `imgs/tom-jump.png`;
    return;
  }
  if (currentFrameTime >= FRAME_TIME) {
    tomFrame = (tomFrame + 1) % TOM_FRAME_COUNT;
    tomElem.src = `imgs/tom-run-${tomFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(tomElem, '--bottom', yVelocity * delta - (yVelocity * delta) / 2.5);
  if (getCustomProperty(tomElem, '--bottom') <= 0) {
    setCustomProperty(tomElem, '--bottom', 20);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if (e.code !== 'Space' || isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}
