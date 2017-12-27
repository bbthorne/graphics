"use strict";
let Mesh = function(geometry, material) {
  this.geometry = geometry;
  this.material = material;
  this.gyro = false;
  this.objectType = "";
};
 
Mesh.prototype.draw = function(){
  this.material.commit();
  this.geometry.draw();
};
