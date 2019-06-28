import renderSquare from './renderSquare.js';

window.addEventListener('load', async () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.createElement('canvas');
  document.body.append(canvas);

  // Make the canvas the size of the viewport
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const context = canvas.getContext('webgl');
  renderSquare(context);
});
