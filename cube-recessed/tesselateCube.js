import { white, red, green, blue, yellow, purple, black } from '../colors.js';

export default function tesselateCube() {
  const vertices = [];
  const indices = [];
  const colors = [];

  let index = 0;

  // TODO: Reuse indices of the same vertices automatically to transfer less data
  function addFace(topLeft, topRight, bottomRight, bottomLeft, color) {
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

  addFace([-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1], red); // Back face
  addFace([-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1], green); // Top face
  addFace([-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], blue); // Bottom face
  addFace([1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1], yellow); // Right face
  addFace([-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1], purple); // Left face

  addFace([-1, -1, 1], [1, -1, 1], [1, -.75, 1], [-1, -.75, 1], white); // Front face top row
  addFace([-.75, -.75, 1], [.75, -.75, 1], [.75, -.75, .75], [-.75, -.75, .75], black); // Front face top row recession

  addFace([-1, .75, 1], [1, .75, 1], [1, 1, 1], [-1, 1, 1], white); // Front face bottom row
  addFace([-.75, .75, 1], [.75, .75, 1], [.75, .75, .75], [-.75, .75, .75], black); // Front face bottom row recession

  addFace([.75, -.75, 1], [1, -.75, 1], [1, .75, 1], [.75, .75, 1], white); // Front face right column
  addFace([.75, -.75, 1], [.75, .75, 1], [.75, .75, .75], [.75, -.75, .75], black); // Front face right column recession

  addFace([-1, -.75, 1], [-.75, -.75, 1], [-.75, .75, 1], [-1, .75, 1], white); // Front face left column
  addFace([-.75, -.75, 1], [-.75, .75, 1], [-.75, .75, .75], [-.75, -.75, .75], black); // Front face left column recession

  addFace([-.75, -.75, .75], [-.75, .75, .75], [.75, .75, .75], [.75, -.75, .75], white); // Front face recession

  return { vertices, indices, colors };
}
