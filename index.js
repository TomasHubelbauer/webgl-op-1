import renderSquareScene from './square/index.js';
import renderCubeScene from './cube/index.js';
import renderCubeTexturedScene from './cube-textured/index.js';
import renderCubeRecessedScene from './cube-recessed/index.js';
import renderPipeScene from './pipe/index.js';
import renderCubeRoundedScene from './cube-rounded/index.js';

window.addEventListener('load', async () => {
  /** @type {HTMLCanvasElement} */
  const sceneCanvas = document.getElementById('sceneCanvas');

  const context = sceneCanvas.getContext('webgl', { preserveDrawingBuffer: true /* Enable right-click and save image */ });

  window.addEventListener('resize', () => {
    // Make the canvas the size of the viewport
    sceneCanvas.width = sceneCanvas.clientWidth;
    sceneCanvas.height = sceneCanvas.clientHeight;

    // Update the context viewport dimensions to match the new canvas dimensions
    context.viewport(0, 0, sceneCanvas.width, sceneCanvas.height);
  });

  // Dispatch a fake `resize` event to cause the `canvas` to fit the viewport
  window.dispatchEvent(new Event('resize'));

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
    case 'cube-recessed': {
      renderCubeRecessedScene(context);
      break;
    }
    case 'pipe': {
      renderPipeScene(context);
      break;
    }
    case 'cube-rounded': {
      renderCubeRoundedScene(context);
      break;
    }
    default: {
      alert(`The scene ${sceneSelect.value} was not found`);
      window.location.search = 'cube-textured';
    }
  }

  sceneSelect.addEventListener('change', () => window.location.search = sceneSelect.value);
});
