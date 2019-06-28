import renderSquareScene from './square/index.js';
import renderCubeScene from './cube/index.js';
import renderCubeTexturedScene from './cube-textured/index.js';

window.addEventListener('load', async () => {
  const canvas = document.createElement('canvas');
  document.body.append(canvas);

  window.addEventListener('resize', () => {
    // Make the canvas the size of the viewport
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });

  // Dispatch a fake `resize` event to cause the `canvas` to fit the viewport
  window.dispatchEvent(new Event('resize'));

  // Note that the context doesn't change with the canvas size so we do not need to refresh it
  const context = canvas.getContext('webgl');

  const scene = 'cube-textured';
  switch (scene) {
    case 'square': renderSquareScene(context); break;
    case 'cube': renderCubeScene(context); break;
    case 'cube-textured': renderCubeTexturedScene(context); break;
  }
});
