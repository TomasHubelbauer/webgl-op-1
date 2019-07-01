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

  const scenes = {
    square: renderSquareScene,
    cube: renderCubeScene,
    cubeTextured: renderCubeTexturedScene,
    cubeRecessed: renderCubeRecessedScene,
    pipe: renderPipeScene,
    cubeRounded: renderCubeRoundedScene,
  };

  const defaultScene = 'pipe';

  const sceneSelect = document.getElementById('sceneSelect');
  for (let sceneName in scenes) {
    const sceneOption = document.createElement('option');
    sceneOption.textContent = sceneName;
    sceneSelect.append(sceneOption);
  }

  sceneSelect.value = window.location.search ? window.location.search.substring(1) : defaultScene;

  const scene = scenes[sceneSelect.value];
  if (!scene) {
    alert(`The scene ${sceneSelect.value} was not found`);
    window.location.search = defaultScene;
  }

  scene(context);

  sceneSelect.addEventListener('change', () => window.location.search = sceneSelect.value);
});
