# WebGL OP-1

I attempt to design a model of Teenage Engineering's OP-1 in WebGL in order to
practice WebGL programming in a goal-driven way.

![](op-1.png)

Image credit: https://en.wikipedia.org/wiki/File:OP-1_Sequencer_Concept.png

- Set up basic lighting in the OP-1 scene
- Find out if I can speed up the Droste demo: https://stackoverflow.com/q/56841018/2715716
- Create a demo of a cube with rounded corners
- Add front and back faces to the cube with rounded vertical edge axes
  (Generate tris for each arc face and add a back face and a front recessed face)
- Create a demo where a portion of the mesh is textured and another just colored
  (Probably need to pass this information to the shared and go with color/UV depending)
- Create a scene with multiple objects in it
- Create a scene with a WebGL portal in it (does WebGL support non-Euclidean?)
- Figure out how to allow rotating using the mouse and scaling using the wheel
  - https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm
- Make the cube roughly OP-1 sized and add rounded corners to it
  - https://teenage.engineering/guides/op-1/main-modes
- Add recessions for the keyboard area, the battery indicator and the mic
  - Decide whether to do this using CSG or by adjusting the tesselation code manually
    (Would prefer to do that manually but it may get prohibitively complex to do)
  - https://github.com/jscad/csg.js/
  - Consider prototyping the OP-1 model in OpenSCAD first to see if CSG is what I need
  - Figure out how to take the CSG output and render that using WebGL
  - https://github.com/jscad/csg.js/issues/92 (this is ThreeJS/LightGL)
- Render the OP-1 text on the side of the keyboard
  - https://stackoverflow.com/a/35027166/2715716
  - https://delphic.me.uk/tutorials/webgl-text
  - https://webglfundamentals.org/webgl/lessons/webgl-text-canvas2d.html
  - https://webglfundamentals.org/webgl/lessons/webgl-text-glyphs.html
  - Consider the fact this this is a short, static text and might be better as
    just a plain texture
- Design a key and render the keyboard by repeating an array of them
- Figure out what to do next based on how it went so far
- Consider hooking this up with WebMIDI and depressing keys as pressed on the OP-1
- Consider using WebMIDI the other way too - play a note when pressing a key on
  the model
  - Not sure if the OP-1 can receive MIDI as input so that the note would play
    through it and not the browser, but the keyboard might be able to do this
- Replace the matrix libray with in-tree routines to keep the thing flat and
  straightforward to read and understand
- Find out what `vertexAttribPointer`'s `normalize` argument is for (clamping?)
- Consider designing (some of) the internals as well so that I could make an
  exploded view of the device

---

```js
const context = document.createElement('canvas').getContext('webgl');
context.getParameter(context.MAX_TEXTURE_IMAGE_UNITS);
```

| Browser | Max Texture Image Units |
|-|-|
| Firefox | 16 |
| Chrome | 16 |
| Edge | 16 |
| Safari | ? |

---

The default WebGL depth testing function is `LESS`.

---

WebGL only seems to be able to draw points, lines and tris, not quads
(without triangulation).
