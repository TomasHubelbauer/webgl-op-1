import setupProgram from '../setupProgram.js';

// Distilled from https://www.geertarien.com/blog/2017/08/30/blinn-phong-shading-using-webgl
export default async function renderCubeScene(/** @type {WebGLRenderingContext} */ _context) {
  // Build own context because the project matrix used here is hardcoded for 300x150
  _context.canvas.remove();
  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  const context = canvas.getContext('webgl');

  const {
    vNormal: vertexShadervNormalAttributeLocation,
    vPosition: vertexShadervPositionAttributeLocation,
    modelViewMatrix: vertexShaderModelViewMatrixUniformLocation,
    projectionMatrix: vertexShaderProjectionMatrixUniformLocation,
    theta: vertexShaderThetaUniformLocation,
    lightPosition: vertexShaderLightPositionUniformLocation,
    ambientProduct: vertexShaderAmbientProductUniformLocation,
    diffuseProduct: vertexShaderDiffuseProductUniformLocation,
    specularProduct: vertexShaderSpecularProductUniformLocation,
    shininess: vertexShaderShininessUniformLocation,
  } = await setupProgram(context, 'cube-shaded/vertex.glsl', 'cube-shaded/fragment.glsl', {
    vNormal: 'attribute',
    vPosition: 'attribute',
    modelViewMatrix: 'uniform',
    projectionMatrix: 'uniform',
    theta: 'uniform',
    lightPosition: 'uniform',
    ambientProduct: 'uniform',
    diffuseProduct: 'uniform',
    specularProduct: 'uniform',
    shininess: 'uniform',
  });

  context.enable(context.DEPTH_TEST);

  // Model view matrix: eye = (0, 0, 4), at = (0, 0, 0), up = (0, 1, 0) => lookAt(eye, at, up)
  context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -4, 1]));

  // Projection matrix: fov = 55, aspect = width / height, near = .3, far = 5 => perspective(fov, aspect, near, far)
  context.uniformMatrix4fv(vertexShaderProjectionMatrixUniformLocation, false, new Float32Array([.96, 0, 0, 0, 0, 1.92, 0, 0, 0, 0, -1.12, -1, 0, 0, -.63, 0]));

  // Light position
  context.uniform4fv(vertexShaderLightPositionUniformLocation, new Float32Array([-1.5, 2.0, 4.0, 1]));

  // Product of light ambient (.2, .2, .2, 1) and material ambient (0, 1, 0, 1)
  context.uniform4fv(vertexShaderAmbientProductUniformLocation, new Float32Array([0, .2, 0, 1]));

  // Product of light diffuse (1, 1, 1, 1) and material diffuse (.4, .8, .4, 1)
  context.uniform4fv(vertexShaderDiffuseProductUniformLocation, new Float32Array([.4, .8, .4, 1]));

  // Product of light specular (1, 1, 1, 1) and material specular (0, .4, .4, 1)
  context.uniform4fv(vertexShaderSpecularProductUniformLocation, new Float32Array([0, .4, .4, 1]));

  // Material shininess
  context.uniform1f(vertexShaderShininessUniformLocation, 300);

  const pointBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, pointBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array([
    // Top face tri 1 XYZ?XYZ?XYZ?
    -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1,
    // Top face tri 2 XYZ?XYZ?XYZ?
    -1, 1, 1, 1, 1, 1, -1, 1, -1, 1, -1, 1,
    // Left face tri 1 XYZ?XYZ?XYZ?
    -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, 1, 1,
    // Left face tri 2 XYZ?XYZ?XYZ?
    -1, 1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1,
    // Back face tri 1 XYZ?XYZ?XYZ?
    -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1, 1,
    // Back face tri 2 XYZ?XYZ?XYZ?
    -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1,
    // Right face tri 1 XYZ?XYZ?XYZ?
    1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, 1,
    // Right face tri 2 XYZ?XYZ?XYZ?
    1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1,
    // Bottom face tri 1 XYZ?XYZ?XYZ?
    1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1,
    // Bottom face tri 2 XYZ?XYZ?XYZ?
    1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, 1,
    // Front face tri 1 XYZ?XYZ?XYZ?
    1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, 1,
    // Front face tri 2 XYZ?XYZ?XYZ?
    1, -1, -1, 1, -1, 1, -1, 1, 1, 1, -1, 1,
  ]), context.STATIC_DRAW);

  context.vertexAttribPointer(vertexShadervPositionAttributeLocation, 4, context.FLOAT, false, 0, 0);
  context.enableVertexAttribArray(vertexShadervPositionAttributeLocation);

  const normalBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array([
    // Top face tri 1 XYZ?XYZ?XYZ?
    0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    // Top face tri 2 XYZ?XYZ?XYZ?
    0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    // Left face tri 1 XYZ?XYZ?XYZ?
    -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
    // Left face tri 2 XYZ?XYZ?XYZ?
    -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
    // Back face tri 1 XYZ?XYZ?XYZ?
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    // Back face tri 2 XYZ?XYZ?XYZ?
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    // Right face tri 1 XYZ?XYZ?XYZ?
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    // Right face tri 2 XYZ?XYZ?XYZ?
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    // Bottom face tri 1 XYZ?XYZ?XYZ?
    0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,
    // Bottom face tri 2 XYZ?XYZ?XYZ?
    0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,
    // Front face tri 1 XYZ?XYZ?XYZ?
    0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
    // Front face tri 2 XYZ?XYZ?XYZ?
    0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
  ]), context.STATIC_DRAW);

  context.vertexAttribPointer(vertexShadervNormalAttributeLocation, 4, context.FLOAT, false, 0, 0);
  context.enableVertexAttribArray(vertexShadervNormalAttributeLocation);

  let rotationX = 0;
  let rotationY = 0;
  let lastTimestamp = performance.now();

  void function render(timestamp) {
    document.title = Math.round(1000 / (timestamp - lastTimestamp)) + ' FPS';

    context.clear(context.COLOR_BUFFER_BIT);
    rotationX += .5;
    rotationY += 1;

    context.uniform3fv(vertexShaderThetaUniformLocation, [rotationX, rotationY, 0]);
    context.drawArrays(context.TRIANGLES, 0, 2 * 3 * 6 /* 2 tris in a face of 3 points each with 6 faces on the cube */);

    // Update timestamp for FPS calculation
    lastTimestamp = timestamp;

    window.requestAnimationFrame(render);
  }()
}
