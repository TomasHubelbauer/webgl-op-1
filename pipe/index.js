import setupProgram from '../setupProgram.js';
import tesselatePipe from './tesselatePipe.js';

export default async function renderPipeScene(/** @type {WebGLRenderingContext} */ context) {
  const {
    vertexPosition: vertexShaderVertexPositionAttributeLocation,
    vertexColor: vertexShaderVertexColorAttributeLocation,
    modelViewMatrix: vertexShaderModelViewMatrixUniformLocation,
    projectionMatrix: vertexShaderProjectionMatrixUniformLocation,
  } = await setupProgram(context, 'pipe/vertex.glsl', 'pipe/fragment.glsl', {
    vertexPosition: 'attribute',
    vertexColor: 'attribute',
    modelViewMatrix: 'uniform',
    projectionMatrix: 'uniform',
  });

  const { vertices, indices, colors } = tesselatePipe();

  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);

  const colorBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.STATIC_DRAW);

  const indexBuffer = context.createBuffer();
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
  context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

  let lastTimestamp = performance.now();
  let rotationRadians = 0;

  function render(timestamp) {
    document.title = Math.round(1000 / (timestamp - lastTimestamp)) + ' FPS';

    // Clear everything
    context.clearColor(0, 0, 0, 1);
    context.clearDepth(1);
    context.enable(context.DEPTH_TEST);
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
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationRadians, [-.25 /* X axis */, 1 /* Y axis */, .25 /* Z axis */]);

    context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, modelViewMatrix);

    context.drawElements(
      context.TRIANGLES,
      indices.length,
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
