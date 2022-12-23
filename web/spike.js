import { getCustomProperty, incrementCustomProperty, setCustomProperty } from './updateCustomProperty.js';

const SPEED = 0.04; // 0.05 (Same speed as ground.js)
const SPIKE_INTERVAL_MIN = 1500;
const SPIKE_INTERVAL_MAX = 3700;

const worldElem = document.querySelector('[data-world]');

let nextSpikeTime;

export function setupSpike() {
  nextSpikeTime = SPIKE_INTERVAL_MIN;
  document.querySelectorAll('[data-spike]').forEach((spike) => {
    spike.remove();
  });
}

export function getSpikeRects() {
  return [...document.querySelectorAll('[data-spike]')].map((spike) => {
    return spike.getBoundingClientRect();
  });
}

export function updateSpike(delta, speedScale) {
  document.querySelectorAll('[data-spike]').forEach((spike) => {
    incrementCustomProperty(spike, '--left', delta * speedScale * SPEED * -1);
    if (getCustomProperty(spike, '--left') <= -100) {
      spike.remove();
    }
  });
  if (nextSpikeTime <= 0) {
    createSpike();
    nextSpikeTime = randomNumberBetween(SPIKE_INTERVAL_MIN, SPIKE_INTERVAL_MAX) / speedScale;
  }
  nextSpikeTime -= delta;
}

function createSpike() {
  const spike = document.createElement('img');
  spike.dataset.spike = true;
  spike.src = 'imgs/spike.png';
  spike.classList.add('spike');
  setCustomProperty(spike, '--left', 100);
  worldElem.append(spike);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
