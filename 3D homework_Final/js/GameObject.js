"use strict";
let GameObject = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(2000, 0, 2000);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.speed = 1;
  this.velocity = this.speed * this.position;
  this.rotateAxis = new Vec3(0,1,0);
  this.picked = false;
  this.timeOfDrop = 0;
  this.modelMatrix = new Mat4();
};

GameObject.prototype.gravity = function(t) {
    if (this.position.y <= 0) return;
    if (this.picked) return;
    let newPos = this.position.y + 0.5 * (-9.8) * Math.pow((t - this.timeOfDrop) * 0.005, 2);
    if (newPos < 0) this.position.y = 0;
    else this.position.y = newPos;
}

GameObject.prototype.updateModelMatrix = function(){
// TODO: set the model matrix according to the position, orientation, and scale
  this.modelMatrix.set().scale(this.scale).rotate(this.orientation, this.rotateAxis).translate(this.position);
};

GameObject.prototype.draw = function(camera, lightSources){
  this.updateModelMatrix();
// TODO: Set the uniform modelViewProjMatrix (reflected in the material) from the modelMatrix (no camera yet). Operator = cannot be used. Use Mat4 methods set() and/or mul().
  //this.mesh.setUniform("modelViewProjMatrix", this.modelMatrix.mul(camera.viewProjMatrix));
  Material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Material.modelMatrix.set(this.modelMatrix);
  Material.modelMatrixInverse.set(this.modelMatrix).invert();
  Material.lightSources.set(lightSources.pos);
  Material.lightPowerDensity.set(lightSources.power);
  Material.direction.set(lightSources.dir);
  this.mesh.draw();
};

GameObject.prototype.move = function(dt, keysPressed) {
    if (keysPressed.I) {
        this.position.add(this.speed * Math.sin(this.orientation), 0, this.speed * Math.cos(this.orientation));
    }
    if (keysPressed.J) {
        this.orientation += -0.1;
    }
    if (keysPressed.K) {
        this.position.add(0, 1, 0);
    }
    if (keysPressed.L) {
        this.position.add(0, -1, 0);
    }
    if (keysPressed.H) {
        this.orientation += 0.1;
    }

    this.updateModelMatrix();
};

// for children
GameObject.prototype.updatePos = function(pos) {
    this.position.x = pos.x;
    this.position.z = pos.z;
    this.position.y = pos.y + 15;
}

GameObject.prototype.shadowDraw = function(lightDirection, camera) {
    //var direction = new Vec4()
    this.updateModelMatrix();
    let projectToPlane = new Mat4([1, 0, 0, 0, -1, 0, -2.5, 0, 0, 0, 1, 0, 0, .01, 0, 1]);
    Material.modelViewProjMatrix.set(this.modelMatrix).scale(new Vec3(this.scale.x, 0, this.scale.z)).translate(new Vec3(0,.5,0)).mul(camera.viewProjMatrix);
    Material.modelMatrix.set(this.modelMatrix);
    //Material.projectToPlane.set(projectToPlane);
    /*
    Material.projectToPlane = new Mat4(1, 0, 0, 0,
                        lightDirection.x, 0, lightDirection.z, 0,
                                       0, 0, 1, 0,
                                       0, 0, 0, 1);
    */
    this.mesh.draw();
};
