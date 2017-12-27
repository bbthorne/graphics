var OrthoCamera = function() {
  this.position = new Vec2(5, 5);
  this.rotation = 0;
  this.windowSize = new Vec2(12, 12);

  this.viewProjMatrix = new Mat4();
  this.shake = function(time) {
      this.position.add(new Vec2(Math.sin(time)/15, 0));
      this.updateViewProjMatrix();
  }
  this.updateViewProjMatrix();
};

// updates camera location in game world
OrthoCamera.prototype.updateViewProjMatrix = function(){
  this.viewProjMatrix.set().
    scale(0.5).
    scale(this.windowSize).
    rotate(this.rotation).
    translate(this.position).
    invert();
};

OrthoCamera.prototype.setAspectRatio = function(ar)
{
  this.windowSize.x = this.windowSize.y * ar;
  this.updateViewProjMatrix();
};
