const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const X_ORIGIN = CANVAS_WIDTH / 2;
const Y_ORIGIN = CANVAS_HEIGHT / 4;
const BASE_TILE_WIDTH = 32;
const BASE_TILE_HEIGHT = 32;
const VECT_I = [1, 0.5];
const VECT_J = [-1, 0.5];
const SQRT_NUMBER_OF_CUBES = 15;
const WAVE_AMPLITUDE = 30;
const WAVE_X_COMPONENT = 100; // Négatif pour inverser les sens de la vague
const WAVE_Y_COMPONENT = 100;
const WAVE_FREQUENCY = 300;

const image = new Image(BASE_TILE_WIDTH, BASE_TILE_HEIGHT);
image.src = 'cube.png';
const imageLoaded = new Promise((resolve) => { image.onload = () => { resolve(); }; });

function draw() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (let i = 0; i < SQRT_NUMBER_OF_CUBES; i += 1) {
    for (let j = 0; j < SQRT_NUMBER_OF_CUBES; j += 1) {
      let vi = math.multiply(VECT_I, i);
      let vj = math.multiply(VECT_J, j);

      [vi, vj] = math.add(vi, vj);

      vi = X_ORIGIN + vi * (BASE_TILE_WIDTH * 2) * 0.5;
      vj = Y_ORIGIN + vj * (BASE_TILE_HEIGHT * 2) * 0.5;

      const v = Math.sin((+new Date() + ((i * WAVE_X_COMPONENT) + (j * WAVE_Y_COMPONENT))) / WAVE_FREQUENCY) * WAVE_AMPLITUDE;
      vj += v;

      context.drawImage(image, 0, 0, BASE_TILE_WIDTH, BASE_TILE_HEIGHT, vi, vj, BASE_TILE_WIDTH * 2, BASE_TILE_HEIGHT * 2);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  draw();
}

imageLoaded.then(() => {
  animate();
});
