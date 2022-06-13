const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const _ = window;
_.CANVAS_WIDTH = 800;
_.CANVAS_HEIGHT = 600;
_.BASE_TILE_SIZE = 32;
_.X_ORIGIN = (_.CANVAS_WIDTH - _.BASE_TILE_SIZE) / 2;
_.Y_ORIGIN = _.CANVAS_HEIGHT / 4;
_.TILE_ZOOM = 1;
_.EFFECTIVE_TILE_SIZE = _.BASE_TILE_SIZE * _.TILE_ZOOM;
_.VECT_I = [0.5, 0.25];
_.VECT_J = [-0.5, 0.25];
_.SQRT_NUMBER_OF_CUBES = 24;
_.WAVE_AMPLITUDE = 20;
_.WAVE_X_COMPONENT = 100; // Négatif pour inverser les sens de la vague
_.WAVE_Y_COMPONENT = 50;
_.WAVE_FREQUENCY = 300;

const cubeImage = new Image(_.BASE_TILE_SIZE, _.BASE_TILE_SIZE);
cubeImage.src = 'cube.png';
const cubeImageLoaded = new Promise((resolve) => { cubeImage.onload = () => { resolve(); }; });

const highlightImage = new Image();
highlightImage.src = 'cube-highlight.png';
const cubeHighlightImageLoaded = new Promise((resolve) => { highlightImage.onload = () => { resolve(); }; });

let selectionI = 5;
let selectionJ = 14;

function IJToIsoXY(i, j) {
  let vi = math.multiply(_.VECT_I, i);
  let vj = math.multiply(_.VECT_J, j);

  [vi, vj] = math.add(vi, vj);

  vi = _.X_ORIGIN + vi * (_.EFFECTIVE_TILE_SIZE);
  vj = _.Y_ORIGIN + vj * (_.EFFECTIVE_TILE_SIZE);

  return { vi, vj };
}

function draw() {
  context.clearRect(0, 0, _.CANVAS_WIDTH, _.CANVAS_HEIGHT);
  for (let i = 0; i < _.SQRT_NUMBER_OF_CUBES; i += 1) {
    for (let j = 0; j < _.SQRT_NUMBER_OF_CUBES; j += 1) {
      const conv = IJToIsoXY(i, j);
      const { vi } = conv;
      let { vj } = conv;

      const v = Math.sin((+new Date() + ((i * _.WAVE_X_COMPONENT) + (j * _.WAVE_Y_COMPONENT))) / _.WAVE_FREQUENCY) * _.WAVE_AMPLITUDE;
      vj += v;

      context.drawImage(cubeImage, 0, 0, _.BASE_TILE_SIZE, _.BASE_TILE_SIZE, vi, vj, _.EFFECTIVE_TILE_SIZE, _.EFFECTIVE_TILE_SIZE);

      if (i === selectionI && j === selectionJ) context.drawImage(highlightImage, 0, 0, _.BASE_TILE_SIZE, highlightImage.height, vi, vj - ((highlightImage.height * _.TILE_ZOOM) - _.EFFECTIVE_TILE_SIZE), _.EFFECTIVE_TILE_SIZE, highlightImage.height * _.TILE_ZOOM);
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
  selectionJ += _.SQRT_NUMBER_OF_CUBES;
  selectionI += _.SQRT_NUMBER_OF_CUBES;
  selectionJ %= _.SQRT_NUMBER_OF_CUBES;
  selectionI %= _.SQRT_NUMBER_OF_CUBES;
});

// canvas.addEventListener('mousemove', (e) => {
//   const x = e.offsetX;
//   const y = e.offsetY;
//   const conv = XYToIJ(x, y);
//   console.log(conv);
//   selectionI = conv.vi;
//   selectionJ = conv.vj;
// });

document.querySelectorAll('#controls .slider').forEach((element) => {
  const valueDisplay = element.parentElement.querySelector('.value');
  const { variable } = element.dataset;
  element.value = _[variable];
  valueDisplay.textContent = element.value;
  element.addEventListener('input', () => {
    _[variable] = +element.value;
    valueDisplay.textContent = element.value;
  });
});
