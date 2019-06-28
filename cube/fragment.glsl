// Receive the color in the varying set by the vertex shader
varying lowp vec4 color;

void main() {
  gl_FragColor = color;
}
