"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  this.textureVS = new Shader(gl, gl.VERTEX_SHADER, "texture_vs.essl");
  this.textureFS = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");

  this.procedureFS = new Shader(gl, gl.FRAGMENT_SHADER, "procedure_fs.essl");

  this.shinyFS = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");

  this.trianglePosition = new Vec3(0,0,0);
  this.trianglePosition1 = new Vec3(0,0.5,0);

  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TexturedProgram(gl, this.textureVS, this.textureFS);
  this.procedureProgram = new Program(gl, this.textureVS, this.procedureFS);
  this.shinyProgram = new TexturedProgram(gl, this.textureVS, this.shinyFS);

  this.triangleGeometry = new TriangleGeometry(gl);
  this.quadGeometry = new QuadGeometry(gl);
  this.timeAtLastFrame = new Date().getTime();
  this.rotatescale = 0.2;
  this.sizescale = new Vec3(1,1,0);

  this.material = new Material(gl, this.solidProgram);
  this.material.solidColor.set(0, 0, 0);
  this.mesh = new Mesh(this.triangleGeometry, this.material);

  this.shinyMaterial = new Material(gl, this.shinyProgram);
  this.shinyMaterial.probeTexture.set(new Texture2D(gl, "envmaps/probe2017fall1.png"));
  this.shinyMaterial1 = new Material(gl, this.shinyProgram);
  this.shinyMaterial1.probeTexture.set(new Texture2D(gl, "envmaps/probe2017fall2.png"));

  this.slowpokeMaterial = new Material(gl, this.textureProgram);
  this.slowpokeMaterial.colorTexture.set(new Texture2D(gl, "slowpoke/YadonDh.png"));
  this.slowpokeMaterial1 = new Material(gl, this.textureProgram);
  this.slowpokeMaterial1.colorTexture.set(new Texture2D(gl, "slowpoke/YadonEyeDh.png"));
  this.slowpokeMaterials = [];
  this.slowpokeMaterials.push(this.slowpokeMaterial);
  this.slowpokeMaterials.push(this.slowpokeMaterial1);

  this.marbleMaterial = new Material(gl, this.procedureProgram);
  this.marbleMesh = new MultiMesh(gl, "slowpoke/Slowpoke.json", [this.marbleMaterial, this.marbleMaterial]);
  this.marbleShadowMesh = new MultiMesh(gl, "slowpoke/Slowpoke.json", [this.material, this.material]);

  this.slowpoke = new GameObject(this.marbleMesh);
  this.slowpokeShadow = new GameObject(this.marbleShadowMesh);
  this.slowpoke.scale.mul(5,5,5);
  this.slowpoke.position.add(0,0,50);

  this.heliTexture = new Material(gl, this.textureProgram);
  this.heliTexture.colorTexture.set(new Texture2D(gl, "json/heli/heliait.png"));

  this.heliMaterials = [this.shinyMaterial, this.shinyMaterial1];

  this.heliMesh = new MultiMesh(gl, "json/heli/heli1.json", this.heliMaterials);
  this.heliRotorMesh = new MultiMesh(gl, "json/heli/mainrotor.json", this.slowpokeMaterials);
  this.heliShadowMesh = new MultiMesh(gl, "json/heli/heli1.json", [this.material]);
  this.heliRotorShadowMesh = new MultiMesh(gl, "json/heli/mainrotor.json", [this.material, this.material]);

  this.heli = new GameObject(this.heliMesh);
  this.heliShadow = new GameObject(this.heliShadowMesh);
  this.heli.child = new GameObject(this.heliRotorMesh);
  this.heli.childShadow = new GameObject(this.heliRotorShadowMesh);
  this.heli.child.position.add(new Vec3(0,15,0));
  this.heli.position.add(-100,0,100);

  this.groundMaterial = new Material(gl, this.textureProgram);
  this.groundMaterial.colorTexture.set(new Texture2D(gl, "json/salad.png"));

  this.groundMesh = new Mesh(this.quadGeometry, this.groundMaterial);
  this.ground = new GameObject(this.groundMesh);
  this.ground.position.set(this.slowpoke.position);

  this.treeMaterial = new Material(gl, this.textureProgram);
  this.treeMaterial.colorTexture.set(new Texture2D(gl, "json/tree.png"));
  this.treeMesh = new MultiMesh(gl, "json/smoothtree.json", [this.treeMaterial]);
  this.treeArray = [];
  for (var i = 0; i < 20; i++) {
       this.treeArray[i] = new GameObject(this.treeMesh);
       this.treeArray[i].position.set(this.slowpoke.position).add(50 + 10*i,0,100*i);
       this.treeArray[i].scale.mul(2,2,2);
  }

  this.camera = new PerspectiveCamera();

  this.lightSources = {};
  this.lightSources.pos = new Vec4Array(3);
  this.lightSources.pos.at(0).set(1,2.5,1,0);
  this.lightSources.pos.at(1).set(this.heli.position.x, this.heli.position.y, this.heli.position.z, 1);

  this.lightSources.dir = new Vec3(0, -1, 0);

  this.lightSources.power = new Vec3Array(3);
  this.lightSources.power.at(0).set(10,10,10);
  this.lightSources.power.at(1).set(100000,100000,100000);
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false

  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.53, 0.81, 0.98, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.heli.move(dt, keysPressed);
  this.heli.child.updatePos(this.heli.position);
  this.heli.childShadow.updatePos(this.heli.position);

  this.slowpoke.draw(this.camera, this.lightSources);
  this.slowpokeShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);

  this.heli.draw(this.camera, this.lightSources);
  this.heliShadow.position.set(this.heli.position);
  this.heliShadow.orientation = this.heli.orientation;

  this.heliShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);
  this.heli.child.orientation += .5;
  this.heli.childShadow.orientation += .5;
  this.heli.child.draw(this.camera, this.lightSources);
  this.heli.childShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);
  this.ground.draw(this.camera, this.lightSources);

  for (var i = 0; i < this.treeArray.length; i++) {
      this.treeArray[i].draw(this.camera, this.lightSources);
  }

  this.updatePointLight();
  this.camera.move(this.timeAtLastFrame, keysPressed, this.heli);

  gl.enable(gl.DEPTH_TEST);
  this.solidProgram.commit();
};

Scene.prototype.updatePointLight = function() {
    this.lightSources.pos.at(1).set(this.heli.position.x, this.heli.position.y - 1, this.heli.position.z, 1);
}
