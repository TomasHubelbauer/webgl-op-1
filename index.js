import renderSquareScene from './square/index.js';
import renderCubeScene from './cube/index.js';
import renderCubeTexturedScene from './cube-textured/index.js';

window.addEventListener('load', async () => {
  const sceneCanvas = document.getElementById('sceneCanvas');

  window.addEventListener('resize', () => {
    // Make the canvas the size of the viewport
    sceneCanvas.width = sceneCanvas.clientWidth;
    sceneCanvas.height = sceneCanvas.clientHeight;
  });

  // Dispatch a fake `resize` event to cause the `canvas` to fit the viewport
  window.dispatchEvent(new Event('resize'));

  // Note that the context doesn't change with the canvas size so we do not need to refresh it
  const context = sceneCanvas.getContext('webgl', { preserveDrawingBuffer: true /* Enable right-click and save image */ });

  const sceneSelect = document.getElementById('sceneSelect');
  if (window.location.search) {
    sceneSelect.value = window.location.search.substring(1);
  }

  switch (sceneSelect.value) {
    case 'square': {
      renderSquareScene(context);
      break;
    }
    case 'cube': {
      renderCubeScene(context);
      break;
    }
    case 'cube-textured': {
      renderCubeTexturedScene(context);
      break;
    }
    default: {
      alert(`The scene ${sceneSelect.value} was not found`);
      window.location.search = 'cube-textured';
    }
  }

  sceneSelect.addEventListener('change', () => window.location.search = sceneSelect.value);
});
