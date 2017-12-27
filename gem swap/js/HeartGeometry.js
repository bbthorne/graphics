"use strict";

let HeartGeometry = function(gl) {
  this.gl = gl;

  // ARRAY_BUFFER = vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  let indices = [0,0,0];
  let t = 0;

  for (let i = 0; i < 20; i++) {
      indices.push((16*Math.pow(Math.sin(t), 3))/100);
      indices.push((13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t))/100);
      indices.push(0);
      t += Math.PI/10;
  }


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW); // static as vertices will never change

  // vertex color
  this.colorBuffer = gl.createBuffer();
  let color = [1, 1, 1]
  for (var i = 3; i < indices.length; i+=3) {
      color[i] = 0.5;
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
      0, 2, 3,
      0, 3, 4,
      0, 4, 5,
      0, 5, 6,
      0, 6, 7,
      0, 7, 8,
      0, 8, 9,
      0, 9, 10,
      0, 10, 11,
      0, 11, 12,
      0, 12, 13,
      0, 13, 14,
      0, 14, 15,
      0, 15, 16,
      0, 16, 17,
      0, 17, 18,
      0, 18, 19,
      0, 19, 20,
      0, 20, 1
    ]),
    gl.STATIC_DRAW);
};

HeartGeometry.prototype.draw = function() {
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

  gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);
};
