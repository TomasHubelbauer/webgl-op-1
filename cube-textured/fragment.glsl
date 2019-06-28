// Receive the color in the varying set by the vertex shader
varying highp vec2 textureCoordinate;

uniform sampler2D textureSampler;

void main() {
  gl_FragColor = texture2D(textureSampler, textureCoordinate);
}
