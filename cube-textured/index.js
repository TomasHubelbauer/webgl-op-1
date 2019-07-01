import setupProgram from '../setupProgram.js';

export default async function renderCubeTexturedScene(/** @type {WebGLRenderingContext} */ context) {
  const {
    vertexPosition: vertexShaderVertexPositionAttributeLocation,
    vertexTextureCoordinate: vertexShaderVertexTextureCoordinateAttributeLocation,
    modelViewMatrix: vertexShaderModelViewMatrixUniformLocation,
    projectionMatrix: vertexShaderProjectionMatrixUniformLocation,
    textureSampler: fragmentShaderTextureSamplerUniformLocation,
  } = await setupProgram(context, 'cube-textured/vertex.glsl', 'cube-textured/fragment.glsl', {
    vertexPosition: 'attribute',
    vertexTextureCoordinate: 'attribute',
    modelViewMatrix: 'uniform',
    projectionMatrix: 'uniform',
    textureSampler: 'uniform',
  });

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

  const textureCoordinateBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, textureCoordinateBuffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([
      0, 0, 1, 0, 1, 1,
      0, 1, 0, 0, 1, 0,
      1, 1, 0, 1, 0, 0,
      1, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1,
      0, 1, 0, 0, 1, 0,
      1, 1, 0, 1, 0, 0,
      1, 0, 1, 1, 0, 1,
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

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 256;
  textureCanvas.height = 256;

  const textureContext = textureCanvas.getContext('2d');

  function render(timestamp) {
    document.title = Math.round(1000 / (timestamp - lastTimestamp)) + ' FPS';

    for (let x = 0; x < textureCanvas.width / 8; x++) {
      for (let y = 0; y < textureCanvas.height / 8; y++) {
        textureContext.fillStyle = x % 2 === 0 ^ y % 2 === 0 ? 'silver' : 'white';
        textureContext.fillRect(x * 8, y * 8, 8, 8);
      }
    }

    textureContext.resetTransform();
    textureContext.rotate(Math.PI / 2);
    textureContext.fillStyle = 'red';
    textureContext.font = 'normal 40px sans-serif';
    textureContext.fillText(new Date().toLocaleTimeString(), 10, -10);

    const length = Math.min(context.canvas.width, context.canvas.height);
    textureContext.resetTransform();
    textureContext.drawImage(context.canvas, (context.canvas.width - length) / 2, (context.canvas.height - length) / 2, length, length, 50, 10, 195, 195);

    const texture = context.createTexture();
    context.bindTexture(context.TEXTURE_2D, texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, textureCanvas);
    context.generateMipmap(context.TEXTURE_2D); // Only works for textures with size of power of two  

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

    context.bindBuffer(context.ARRAY_BUFFER, textureCoordinateBuffer);
    context.vertexAttribPointer(
      vertexShaderVertexTextureCoordinateAttributeLocation,
      2, // Feed the shader 2 floats from the texture coordinate buffer per iteration
      context.FLOAT, // The position buffer is a `Float32Array`
      false, // TODO: Find out what this does
      0, // Do not set stride, instead use the size and type arguments above
      0, // Start at the beginning of the texture coordinate array
    );

    context.enableVertexAttribArray(vertexShaderVertexTextureCoordinateAttributeLocation);

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
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationRadians, [0, 1, /* Y axis */ 1 /* Z axis */]);

    context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, modelViewMatrix);

    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture);
    context.uniform1i(fragmentShaderTextureSamplerUniformLocation, 0);

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
