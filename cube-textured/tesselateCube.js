export default function tesselateCube() {
  return [
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
  ];
}
