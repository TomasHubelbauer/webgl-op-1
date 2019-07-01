import tesselateCube from './tesselateCube.js';
import { white, red, green, blue, yellow, purple } from '../colors.js';

export default async function renderCubeScene(/** @type {WebGLRenderingContext} */ context) {
  const vertexPromise = fetch('cube/vertex.glsl').then(response => response.text());
  const fragmentPromise = fetch('cube/fragment.glsl').then(response => response.text());
  const [vertexSource, fragmentSource] = await Promise.all([vertexPromise, fragmentPromise]);

  const vertexShader = context.createShader(context.VERTEX_SHADER);
  context.shaderSource(vertexShader, vertexSource);
  context.compileShader(vertexShader);
  if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
    context.deleteShader(vertexShader);
    alert('Failed to compile the vertex shader: ' + context.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
  context.shaderSource(fragmentShader, fragmentSource);
  context.compileShader(fragmentShader);
  if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
    context.deleteShader(fragmentShader);
    alert('Failed to compile the fragment shader: ' + context.getShaderInfoLog(fragmentShader));
  }

  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    context.deleteProgram(program);
    alert('Failed to link the program: ' + context.getProgramInfoLog(program));
  }

  const vertexShaderVertexPositionAttributeLocation = context.getAttribLocation(program, 'vertexPosition');
  const vertexShaderVertexColorAttributeLocation = context.getAttribLocation(program, 'vertexColor');
  const vertexShaderModelViewMatrixUniformLocation = context.getUniformLocation(program, 'modelViewMatrix');
  const vertexShaderProjectionMatrixUniformLocation = context.getUniformLocation(program, 'projectionMatrix');

  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([
      // Front face
      -1, -1, 1,
      1, -1, 1,
      1, 1, 1,
      -1, 1, 1,

      // Back face
      -1, -1, -1,
      -1, 1, -1,
      1, 1, -1,
      1, -1, -1,

      // Top face
      -1, 1, -1,
      -1, 1, 1,
      1, 1, 1,
      1, 1, -1,

      // Bottom face
      -1, -1, -1,
      1, -1, -1,
      1, -1, 1,
      -1, -1, 1,

      // Right face
      1, -1, -1,
      1, 1, -1,
      1, 1, 1,
      1, -1, 1,

      // Left face
      -1, -1, -1,
      -1, -1, 1,
      -1, 1, 1,
      -1, 1, -1,
    ]),
    context.STATIC_DRAW
  );

  const colorBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([
      ...white, ...white, ...white, ...white, // Front face
      ...red, ...red, ...red, ...red, // Back face
      ...green, ...green, ...green, ...green, // Top face
      ...blue, ...blue, ...blue, ...blue, // Bottom face
      ...yellow, ...yellow, ...yellow, ...yellow, // Right face
      ...purple, ...purple, ...purple, ...purple, // Left face
    ]),
    context.STATIC_DRAW
  );

  const indexBuffer = context.createBuffer();
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
  context.bufferData(
    context.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2, 0, 2, 3, // Front face
      4, 5, 6, 4, 6, 7, // Back face
      8, 9, 10, 8, 10, 11, // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23, // Left face
    ]),
    context.STATIC_DRAW
  );

  let lastTimestamp = performance.now();
  let rotationRadians = 0;

  function render(timestamp) {
    document.title = Math.round(1000 / (timestamp - lastTimestamp)) + ' FPS';

    // Clear everything
    context.clearColor(0, 0, 0, 1);
    context.clearDepth(1);
    context.enable(context.DEPTH_TEST);
    context.depthFunc(context.LEQUAL);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    context.vertexAttribPointer(
      vertexShaderVertexPositionAttributeLocation,
      3, // Feed the shader 3 floats from the position buffer per iteration (XYZ)
      context.FLOAT, // The position buffer is a `Float32Array`
      false, // TODO: Find out what this does
      0, // Do not set stride, instead use the size and type arguments above
      0, // Start at the beginning of the position array
    );

    context.enableVertexAttribArray(vertexShaderVertexPositionAttributeLocation);

    context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
    context.vertexAttribPointer(
      vertexShaderVertexColorAttributeLocation,
      4, // Feed the shader 4 floats from the color buffer per iteration
      context.FLOAT, // The position buffer is a `Float32Array`
      false, // TODO: Find out what this does
      0, // Do not set stride, instead use the size and type arguments above
      0, // Start at the beginning of the color array
    );

    context.enableVertexAttribArray(vertexShaderVertexColorAttributeLocation);

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);

    context.useProgram(program);

    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      45 * Math.PI / 180, // 45 ° degree field of view in radians
      context.canvas.width / context.canvas.height, // The canvas aspect ratio
      .1, // Nearest distance the camera will render
      100, // Farthest distance the camera will render
    );

    context.uniformMatrix4fv(vertexShaderProjectionMatrixUniformLocation, false, projectionMatrix);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationRadians, [0, 1, /* Y axis */ 1 /* Z axis */]);

    context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, modelViewMatrix);

    context.drawElements(
      context.TRIANGLES,
      36, // 36 vertices / indices
      context.UNSIGNED_SHORT, // The index buffer is an `Uint16Array`
      0, // Start at the beginning of the index array
    )

    // Update timestamp for FPS calculation
    lastTimestamp = timestamp;

    // Animate the rotation
    rotationRadians += .025;
    window.requestAnimationFrame(render);
  }

  render();
}
