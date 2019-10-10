export { initCanvas, drawDmdShaded };

const CANVAS_HEIGHT = 192;
const CANVAS_WIDTH = 768;
const GRID_SIZE = 12;
const KOL = [
  'rgb(255,0,0)',
  'rgb(43,62,67)',
  'rgb(182,155,93)',
  'rgb(254, 255, 211)',
];

let canvasContext;

function initCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvasContext = canvas.getContext('2d');
}

/**
 * renders 128 x 32 DMD to canvas
 * @param {uint8array} data data
 */
function drawDmdShaded(data) {
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let offsetX = 0;
  let offsetY = 0;
  let color = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      if (color !== data[i]) {
        color = data[i];
        canvasContext.fillStyle = KOL[color];
      }

      canvasContext.fillRect(
        1 + offsetX * GRID_SIZE / 2,
        1 + offsetY * GRID_SIZE / 2,
        GRID_SIZE / 2 - 1,
        GRID_SIZE / 2 - 1);
    }
    offsetX++;
    if (offsetX === 128) {
      offsetX = 0;
      offsetY++;
    }
  }
}
