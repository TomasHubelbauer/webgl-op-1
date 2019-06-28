attribute vec4 vertexPosition;
attribute vec2 vertexTextureCoordinate;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 textureCoordinate;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;

  // Forward the texture coordinate attribute to the texture coordinate varying available to the fragment shader
  textureCoordinate = vertexTextureCoordinate;
}
