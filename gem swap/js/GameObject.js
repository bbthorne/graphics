"use strict";
let GameObject = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(2.5, 2.5, 2.5);

  this.modelMatrix = new Mat4();

  this.noDraw = false;
  this.objectGone = false;

  // resets an object to default state
  this.objectReset = function() {
      this.noDraw = false;
      this.objectGone = false;
      this.scale = new Vec3(2.5,2.5,2.5);
      this.orientation = 0;
  }
};

GameObject.prototype.updateModelMatrix = function(){
  this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};

GameObject.prototype.draw = function(camera){
  this.updateModelMatrix();
  this.mesh.material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.draw();
};
