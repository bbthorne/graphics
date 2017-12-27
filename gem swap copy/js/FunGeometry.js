"use strict";
let FunGeometry = function(gl) {
  this.gl = gl;

  // ARRAY_BUFFER = vertex buffer
  this.vertexBuffer = gl.createBuffer();
  let indices = [
      0.1, 0.05, 0.1,
      -0.1,  0.05, 0.1,
      0.1,  -0.1, 0.1,
      -0.1, -0.1, 0,
      0,     0.15, 0
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(indices),
    gl.STATIC_DRAW); // static as vertices will never change

  // vertex color
  this.colorBuffer = gl.createBuffer();
  let color = [1, 1, 1]
  for (var i = 3; i < indices.length; i+=3) {
      color[i] = 0;
      color[i+1] = 0.4;
      color[i+2] = 0;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

  // ELEMENT_ARRAY_BUFFER = index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      2, 3, 1,
      0, 1, 4
    ]),
    gl.STATIC_DRAW);
};

FunGeometry.prototype.draw = function() {
  let gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_SHORT, 0);
};
