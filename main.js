const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BASE_TILE_SIZE = 32;
const X_ORIGIN = (CANVAS_WIDTH - BASE_TILE_SIZE) / 2;
const Y_ORIGIN = CANVAS_HEIGHT / 4;
const TILE_ZOOM = 1;
const EFFECTIVE_TILE_SIZE = BASE_TILE_SIZE * TILE_ZOOM;
const VECT_I = [0.5, 0.25];
const VECT_J = [-0.5, 0.25];
const SQRT_NUMBER_OF_CUBES = 24;
const WAVE_AMPLITUDE = 20;
const WAVE_X_COMPONENT = 100; // Négatif pour inverser les sens de la vague
const WAVE_Y_COMPONENT = 50;
const WAVE_FREQUENCY = 300;

const cubeImage = new Image(BASE_TILE_SIZE, BASE_TILE_SIZE);
cubeImage.src = 'cube.png';
const cubeImageLoaded = new Promise((resolve) => { cubeImage.onload = () => { resolve(); }; });

const highlightImage = new Image();
highlightImage.src = 'cube-highlight.png';
const cubeHighlightImageLoaded = new Promise((resolve) => { highlightImage.onload = () => { resolve(); }; });

let selectionI = 5;
let selectionJ = 14;

function IJToIsoXY(i, j) {
  let vi = math.multiply(VECT_I, i);
  let vj = math.multiply(VECT_J, j);

  [vi, vj] = math.add(vi, vj);

  vi = X_ORIGIN + vi * (EFFECTIVE_TILE_SIZE);
  vj = Y_ORIGIN + vj * (EFFECTIVE_TILE_SIZE);

  return { vi, vj };
}

function draw() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (let i = 0; i < SQRT_NUMBER_OF_CUBES; i += 1) {
    for (let j = 0; j < SQRT_NUMBER_OF_CUBES; j += 1) {
      const conv = IJToIsoXY(i, j);
      const { vi } = conv;
      let { vj } = conv;

      const v = Math.sin((+new Date() + ((i * WAVE_X_COMPONENT) + (j * WAVE_Y_COMPONENT))) / WAVE_FREQUENCY) * WAVE_AMPLITUDE;
      vj += v;

      context.drawImage(cubeImage, 0, 0, BASE_TILE_SIZE, BASE_TILE_SIZE, vi, vj, EFFECTIVE_TILE_SIZE, EFFECTIVE_TILE_SIZE);

      if (i === selectionI && j === selectionJ) context.drawImage(highlightImage, 0, 0, BASE_TILE_SIZE, highlightImage.height, vi, vj - ((highlightImage.height * TILE_ZOOM) - EFFECTIVE_TILE_SIZE), EFFECTIVE_TILE_SIZE, highlightImage.height * TILE_ZOOM);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
}

cubeImageLoaded.then(() => {
  animate();
});

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowUp':
      selectionJ -= 1;
      break;
    case 'ArrowRight':
      selectionI += 1;
      break;
    case 'ArrowDown':
      selectionJ += 1;
      break;
    case 'ArrowLeft':
      selectionI -= 1;
      break;
    default: break;
  }
  selectionJ += SQRT_NUMBER_OF_CUBES;
  selectionI += SQRT_NUMBER_OF_CUBES;
  selectionJ %= SQRT_NUMBER_OF_CUBES;
  selectionI %= SQRT_NUMBER_OF_CUBES;
});

// canvas.addEventListener('mousemove', (e) => {
//   const x = e.offsetX;
//   const y = e.offsetY;
//   const conv = XYToIJ(x, y);
//   console.log(conv);
//   selectionI = conv.vi;
//   selectionJ = conv.vj;
// });
