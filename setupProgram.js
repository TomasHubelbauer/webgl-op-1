export default async function setupProgram(/** @type {WebGLRenderingContext} */ context, /** @type {String} */ vertexUrl, /** @type {String} */ fragmentUrl, locationMap) {
  const vertexPromise = fetch(vertexUrl).then(response => response.text());
  const fragmentPromise = fetch(fragmentUrl).then(response => response.text());
  const [vertexSource, fragmentSource] = await Promise.all([vertexPromise, fragmentPromise]);

  const vertexShader = context.createShader(context.VERTEX_SHADER);
  context.shaderSource(vertexShader, vertexSource);
  context.compileShader(vertexShader);
  if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
    alert('Failed to compile the vertex shader: ' + context.getShaderInfoLog(vertexShader));
    context.deleteShader(vertexShader);
    if (!context.getShaderParameter(vertexShader, context.DELETE_STATUS)) {
      alert('Failed to delete the vertex shader.');
    }
  }

  const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
  context.shaderSource(fragmentShader, fragmentSource);
  context.compileShader(fragmentShader);
  if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
    alert('Failed to compile the fragment shader: ' + context.getShaderInfoLog(fragmentShader));
    context.deleteShader(fragmentShader);
    if (!context.getShaderParameter(fragmentShader, context.DELETE_STATUS)) {
      alert('Failed to delete the fragment shader.');
    }
  }

  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  context.validateProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    alert('Failed to link the shader program: ' + context.getProgramInfoLog(program));
    context.deleteProgram(program);
    if (!context.getProgramParameter(program, context.DELETE_STATUS)) {
      alert('Failed to delete the shader program.');
    }
  }

  context.useProgram(program);

  for (let key in locationMap) {
    switch (locationMap[key]) {
      case 'attribute': {
        locationMap[key] = context.getAttribLocation(program, key);
        break;
      }
      case 'uniform': {
        locationMap[key] = context.getUniformLocation(program, key);
        break;
      }
      default: {
        throw new Error(`${key} is neither an attribute nor a uniform!`);
      }
    }
  }

  return locationMap;
}
