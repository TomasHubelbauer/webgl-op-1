precision mediump float;
varying vec3 L, N, E;

uniform vec4 ambientProduct;
uniform vec4 diffuseProduct;
uniform vec4 specularProduct;
uniform float shininess;

void main()
{
  vec4 diffuse = max(dot(L, N), 0.0) * diffuseProduct;
  vec3 H = normalize(L + E);
  vec4 specular = pow(max(dot(N, H), 0.0), shininess) * specularProduct;

  if (dot(L, N) < 0.0) {
    specular = vec4(0.0, 0.0, 0.0, 1.0);
  }

  vec4 fColor = ambientProduct + diffuse + specular;
  fColor.a = 1.0;

  gl_FragColor = fColor;
}
