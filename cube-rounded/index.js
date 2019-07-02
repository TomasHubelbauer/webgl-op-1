import setupProgram from '../setupProgram.js';
import { white, red, green, purple, yellow, blue, black } from '../colors.js';

export default async function renderCubeRoundedScene(/** @type {WebGLRenderingContext} */ context) {
  const {
    vertexPosition: vertexShaderVertexPositionAttributeLocation,
    vertexColor: vertexShaderVertexColorAttributeLocation,
    modelViewMatrix: vertexShaderModelViewMatrixUniformLocation,
    projectionMatrix: vertexShaderProjectionMatrixUniformLocation,
  } = await setupProgram(context, 'cube-rounded/vertex.glsl', 'cube-rounded/fragment.glsl', {
    vertexPosition: 'attribute',
    vertexColor: 'attribute',
    modelViewMatrix: 'uniform',
    projectionMatrix: 'uniform',
  });

  const vertices = [];
  const colors = [];
  const indices = [];

  let index = 0;

  function addTri(peak, baseLeft, baseRight, color) {
    vertices.push(...peak, ...baseLeft, ...baseRight);
    indices.push(index + 0, index + 1, index + 2);
    index += 3;
    colors.push(...color, ...color, ...color);
  }

  // TODO: Reuse indices of the same vertices automatically to transfer less data
  function addQuad(topLeft, topRight, bottomRight, bottomLeft, color) {
    // Create the first triangle
    vertices.push(...topLeft, ...topRight, ...bottomRight);
    indices.push(index + 0, index + 1, index + 2);

    // Create the second triangle
    vertices.push(...bottomLeft);
    indices.push(index + 0, index + 2, index + 3);

    // Increase the index counter
    index += 4;

    // Push the color for each of the four vertices of the face
    colors.push(...color, ...color, ...color, ...color);
  }

  function addArc(x, y, z, radius, steps, offset, range, color) {
    for (let index = 1; index <= steps; index++) {
      const startAngle = offset + ((index - 1) / steps) * range;
      const endAngle = offset + (index / steps) * range;
      const startX = x + Math.sin(startAngle) * radius;
      const startZ = z + Math.cos(startAngle) * radius;
      const endX = x + Math.sin(endAngle) * radius;
      const endZ = z + Math.cos(endAngle) * radius;
      addQuad([startX, y, startZ], [startX, -y, startZ], [endX, -y, endZ], [endX, y, endZ], color);
      addTri([startX, y, startZ], [endX, y, endZ], [x, y, z], color);
      addTri([startX, -y, startZ], [endX, -y, endZ], [x, -y, z], color);
    }
  }

  const width = 28.2;
  const height = 1.35;
  const depth = 10.2;
  const radius = .3;
  const steps = 10;
  const recession = .25;

  // Bottom side
  addQuad([-(width - radius), -height, depth], [width - radius, -height, depth], [width - radius, height, depth], [-(width - radius), height, depth], white);

  // Left side
  addQuad([-width, -height, depth - radius], [-width, -height, -(depth - radius)], [-width, height, -(depth - radius)], [-width, height, depth - radius], white);

  // Top side
  addQuad([-(width - radius), -height, -depth], [width - radius, -height, -depth], [width - radius, height, -depth], [-(width - radius), height, -depth], white);

  // Right side
  addQuad([width, -height, depth - radius], [width, -height, -(depth - radius)], [width, height, -(depth - radius)], [width, height, depth - radius], white);

  // Bottom left
  addArc(-(width - radius), height, depth - radius, radius, steps, Math.PI * 1.5, Math.PI / 2, white);

  // Bottom right corner
  addArc(width - radius, height, depth - radius, radius, steps, 0, Math.PI / 2, white);

  // Top left corner
  addArc(-(width - radius), height, -(depth - radius), radius, steps, Math.PI, Math.PI / 2, white);

  // Top right conter
  addArc(width - radius, height, -(depth - radius), radius, steps, Math.PI / 2, Math.PI / 2, white);

  // Back face top row
  addQuad([-(width - radius), -height, -depth], [width - radius, -height, -depth], [width - radius, -height, -(depth - radius)], [-(width - radius), -height, -(depth - radius)], white);

  // Back face bottom row
  addQuad([-(width - radius), -height, depth - radius], [width - radius, -height, depth - radius], [width - radius, -height, depth], [-(width - radius), -height, depth], white);

  // Back face left column
  addQuad([-width, -height, -(depth - radius)], [-(width - radius), -height, -(depth - radius)], [-(width - radius), -height, depth - radius], [-width, -height, depth - radius], white);

  // Back face left column
  addQuad([width - radius, -height, -(depth - radius)], [width, -height, -(depth - radius)], [width, -height, depth - radius], [width - radius, -height, depth - radius], white);

  // Back face (inset by radius)
  addQuad([-(width - radius), -height, -(depth - radius)], [width - radius, -height, -(depth - radius)], [width - radius, -height, depth - radius], [-(width - radius), -height, depth - radius], white);

  // Front face top row
  addQuad([-(width - radius), height, -depth], [width - radius, height, -depth], [width - radius, height, -(depth - radius)], [-(width - radius), height, -(depth - radius)], white);

  // Front face bottom row
  addQuad([-(width - radius), height, depth - radius], [width - radius, height, depth - radius], [width - radius, height, depth], [-(width - radius), height, depth], white);

  // Front face left column
  addQuad([-width, height, -(depth - radius)], [-(width - radius), height, -(depth - radius)], [-(width - radius), height, depth - radius], [-width, height, depth - radius], white);

  // Front face left column
  addQuad([width - radius, height, -(depth - radius)], [width, height, -(depth - radius)], [width, height, depth - radius], [width - radius, height, depth - radius], white);

  // Front face (inset by radius and recessed)
  addQuad([-(width - radius), height - recession, -(depth - radius)], [width - radius, height - recession, -(depth - radius)], [width - radius, height - recession, depth - radius], [-(width - radius), height - recession, depth - radius], white);

  // Front face top recession wall
  addQuad([-(width - radius), height, -(depth - radius)], [width - radius, height, -(depth - radius)], [width - radius, height - recession, -(depth - radius)], [-(width - radius), height - recession, -(depth - radius)], black);

  // Front face left recession wall
  addQuad([-(width - radius), height, -(depth - radius)], [-(width - radius), height - recession, -(depth - radius)], [-(width - radius), height - recession, depth - radius], [-(width - radius), height, depth - radius], black);

  // Front face right recession wall
  addQuad([width - radius, height - recession, -(depth - radius)], [width - radius, height, -(depth - radius)], [width - radius, height, depth - radius], [width - radius, height - recession, depth - radius], black);

  // Front face bottom recession wall
  addQuad([-(width - radius), height, depth - radius], [-(width - radius), height - recession, depth - radius], [width - radius, height - recession, depth - radius], [width - radius, height, depth - radius], black);

  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);

  const colorBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.STATIC_DRAW);

  const indexBuffer = context.createBuffer();
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
  context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    45 * Math.PI / 180, // 45 ° degree field of view in radians
    context.canvas.width / context.canvas.height, // The canvas aspect ratio
    .1, // Nearest distance the camera will render
    1000, // Farthest distance the camera will render
  );

  context.uniformMatrix4fv(vertexShaderProjectionMatrixUniformLocation, false, projectionMatrix);

  let lastTimestamp = performance.now();

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

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -100]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, timestamp / 1000, [1, 0, 0]);
    context.uniformMatrix4fv(vertexShaderModelViewMatrixUniformLocation, false, modelViewMatrix);

    context.drawElements(
      context.TRIANGLES,
      indices.length,
      context.UNSIGNED_SHORT, // The index buffer is an `Uint16Array`
      0, // Start at the beginning of the index array
    )

    // Update timestamp for FPS calculation
    lastTimestamp = timestamp;

    window.requestAnimationFrame(render);
  }

  render();
}
