# WebGL OP-1

I attempt to design a model of Teenage Engineering's OP-1 in WebGL in order to
practice WebGL programming in a goal-driven way.

- Split the codebase into ES modules and pull out tesselations and renderers of
  the various scenes to their own files
- Backup the current render method and render a cube in the clone
  - https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
- Figure out how to allow rotating using the mouse and scaling using the wheel
- Make the cube roughly OP-1 sized and add rounded corners to it
  - https://teenage.engineering/guides/op-1/main-modes
- Add recessions for the keyboard area, the battery indicator and the mic
- Render the OP-1 text on the side of the keyboard
- Design a key and render the keyboard
- Figure out what to do next based on how it went so far
- Consider hooking this up with WebMIDI and depressing keys as pressed on the OP-1
- Consider using WebMIDI the other way too - play a note when pressing a key on
  the model
- Add an OP-1 favicon
- Resize the canvas if the viewport size changes
- Replace the matrix libray with in-tree routines to keep the thing flat and
  straightforward to read and understand
- Find out what `vertexAttribPointer`'s `normalize` argument is for (clamping?)

Install the `slevesque.shader` VS Code extension to get syntax highlighting in
the GLSL shader files.
