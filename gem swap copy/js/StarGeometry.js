"use strict";

let StarGeometry = function(gl) {
    let rBig = 0.2;
    let rSmall = 0.075;
    let phiBaseBig = Math.PI/2;
    let phiBaseSmall = Math.PI/2 * 3;
    let phiAdd = Math.PI/5 * 2;
  this.gl = gl;

  let indices = [
      0, 0, 0,
      0,  rBig, 0,
      rSmall * Math.cos(phiBaseSmall + 2 * phiAdd), rSmall * Math.sin(phiBaseSmall + 2 * phiAdd), 0,
      -rSmall * Math.cos(phiBaseSmall + 2 * phiAdd), rSmall * Math.sin(phiBaseSmall + 2 * phiAdd), 0,
      rBig * Math.cos(phiBaseBig + phiAdd), rBig * Math.sin(phiBaseBig + phiAdd), 0,
      rSmall * Math.cos(phiBaseSmall - phiAdd), rSmall * Math.sin(phiBaseSmall - phiAdd), 0,
      rBig * Math.cos(phiBaseBig + 2 * phiAdd), rBig * Math.sin(phiBaseBig + 2 * phiAdd), 0,
      rSmall * Math.cos(phiBaseSmall), rSmall * Math.sin(phiBaseSmall), 0,
      rBig * Math.cos(phiBaseBig + 3 * phiAdd), rBig * Math.sin(phiBaseBig + 3 * phiAdd), 0,
      rSmall * Math.cos(phiBaseSmall + phiAdd), rSmall * Math.sin(phiBaseSmall + phiAdd), 0,
      rBig * Math.cos(phiBaseBig + 4 * phiAdd), rBig * Math.sin(phiBaseBig + 4 * phiAdd), 0,
  ];
  // ARRAY_BUFFER = vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(indices),
    gl.STATIC_DRAW); // static as vertices will never change

  // vertex color
  this.colorBuffer = gl.createBuffer();
  let color = [1, 1, 1]
  for (var i = 3; i < indices.length; i+=3) {
      color[i] = 0;
      color[i+1] = 0;
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
      0, 1, 3,
      0, 3, 4,
      0, 4, 5,
      0, 5, 6,
      0, 6, 7,
      0, 7, 8,
      0, 8, 9,
      0, 9, 10,
      0, 2, 10
    ]),
    gl.STATIC_DRAW);
};

StarGeometry.prototype.draw = function() {
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

  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
};
