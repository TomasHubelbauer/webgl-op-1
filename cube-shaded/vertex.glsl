attribute vec4 vNormal;
attribute vec4 vPosition;
varying vec3 L, N, E;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 theta;
uniform vec4 lightPosition;

void main()
{
  vec3 angles = radians(theta);
  vec3 c = cos(angles);
  vec3 s = sin(angles);
  mat4 rx = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, c.x, s.x, 0.0,
    0.0, -s.x, c.x, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  mat4 ry = mat4(
    c.y, 0.0, -s.y, 0.0,
    0.0, 1.0, 0.0, 0.0,
    s.y, 0.0, c.y, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  vec3 pos = (modelViewMatrix * rx * ry * vPosition).xyz;
  vec3 lightPos = (modelViewMatrix * lightPosition).xyz;

  L = normalize(lightPos - pos);
  N = normalize((modelViewMatrix * rx * ry * vNormal).xyz);
  E = -normalize(pos);

  gl_Position = projectionMatrix * modelViewMatrix * rx * ry * vPosition;
}
