import tesselateSquare from '../tesselateSquare.js';

export default async function renderSquare(/** @type {WebGLRenderingContext} */ context) {
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

  let lastTimestamp;
  let rotationRadians = 0;

  function render(timestamp) {
    document.title = Math.round(1000 / (timestamp - lastTimestamp)) + ' FPS';

    // Clear everything
    context.clearColor(0, 0, 0, 1);
    context.clearDepth(1);
    context.enable(context.DEPTH_TEST);
    context.depthFunc(context.LEQUAL);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    const positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(tesselateSquare()), context.STATIC_DRAW);

    const fieldOfView = 45 * Math.PI / 180;
    const aspectRatio = context.canvas.width / context.canvas.height;
    const nearPlane = .1;
    const farPlane = 100;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, nearPlane, farPlane);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationRadians, [0, 0, 1 /* Z axis */]);

    context.vertexAttribPointer(
      vertexShaderVertexPositionAttributeLocation,
      2, // Feed the shader 2 floats from the position buffer per iteration
      context.FLOAT, // The position buffer is a `Float32Array`
      false, // TODO: Find out what this does
      0, // Do not set stride, instead use the size and type arguments above
      0, // Start at the beginning of the array
    );

    context.enableVertexAttribArray(vertexShaderVertexPositionAttributeLocation);

    const colorBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([/* white */ 1, 1, 1, 1, /* red */ 1, 0, 0, 1, /* green */ 0, 1, 0, 1, /* blue */ 0, 0, 1, 1]), context.STATIC_DRAW);

    context.vertexAttribPointer(
      vertexShaderVertexColorAttributeLocation,
      4, // Feed the shader 4 floats from the color buffer per iteration
      context.FLOAT, // The position buffer is a `Float32Array`
      false, // TODO: Find out what this does
      0, // Do not set stride, instead use the size and type arguments above
      0, // Start at the beginning of the array
    );

    context.enableVertexAttribArray(vertexShaderVertexColorAttributeLocation);

    context.useProgram(program);

    context.uniformMatrix4fv(vertexShaderProjectionMatrixUniformLocation, false, projectionMatrix);
    context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, modelViewMatrix);

    context.drawArrays(context.TRIANGLE_STRIP, 0, 4);

    // Update timestamp for FPS calculation
    lastTimestamp = timestamp;

    // Animate the rotation
    rotationRadians += .025;
    window.requestAnimationFrame(render);
  }

  render();
}
