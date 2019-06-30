import { white, red } from '../colors.js';

export default function tesselatePipe() {
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

  function getCoordinates(angle) {
    return [Math.sin(angle), Math.cos(angle)];
  }

  let coordinates = getCoordinates(0);
  let color = false;
  let step = Math.PI / 90;
  for (let angle = step; angle < Math.PI * 2; angle += step) {
    const nextCoordinates = getCoordinates(angle);
    addFace([...coordinates, 1], [...coordinates, -1], [...nextCoordinates, -1], [...nextCoordinates, 1], color ? red : white);

    // Add the same face but on the inner diameter
    addFace(
      [coordinates[0] * .9, coordinates[1] * .9, 1],
      [coordinates[0] * .9, coordinates[1] * .9, -1],
      [nextCoordinates[0] * .9, nextCoordinates[1] * .9, -1],
      [nextCoordinates[0] * .9, nextCoordinates[1] * .9, 1],
      color ? red : white
    );

    // Add the front faces connecting the sides of the outer and inner diameters
    addFace(
      [coordinates[0], coordinates[1], 1],
      [nextCoordinates[0], nextCoordinates[1], 1],
      [nextCoordinates[0] * .9, nextCoordinates[1] * .9, 1],
      [coordinates[0] * .9, coordinates[1] * .9, 1],
      color ? red : white
    );

    // Add the back faces connecting the sides of the outer and inner diameters
    addFace(
      [coordinates[0], coordinates[1], -1],
      [nextCoordinates[0], nextCoordinates[1], -1],
      [nextCoordinates[0] * .9, nextCoordinates[1] * .9, -1],
      [coordinates[0] * .9, coordinates[1] * .9, -1],
      color ? red : white
    );

    coordinates = nextCoordinates;
    color = !color;
  };

  return { vertices, indices, colors };
}
