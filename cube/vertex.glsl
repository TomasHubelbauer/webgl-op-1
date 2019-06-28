attribute vec4 vertexPosition;
attribute vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying lowp vec4 color;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;

  // Forward the color attribute to the color varying available to the fragment shader
  color = vertexColor;
}
