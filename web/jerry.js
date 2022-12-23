const tomElem = document.querySelector('[data-jerry]');

const JERRY_FRAME_COUNT = 3; //Number of tom images to make it moving
const FRAME_TIME = 100;

let jerryFrame;
let currentFrameTime;

export function setupJerry() {
  jerryFrame = 0;
  currentFrameTime = 0;
}

export function updateJerry(delta, speedScale) {
  handleRun(delta, speedScale);
}

function handleRun(delta, speedScale) {
  if (currentFrameTime >= FRAME_TIME) {
    jerryFrame = (jerryFrame + 1) % JERRY_FRAME_COUNT;
    tomElem.src = `imgs/jerry-run-${jerryFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

export function setJerryLose() {
  tomElem.src = 'imgs/jerry-start.png';
}
