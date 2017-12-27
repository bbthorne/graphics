"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  this.textureVS = new Shader(gl, gl.VERTEX_SHADER, "texture_vs.essl");
  this.textureFS = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");

  this.procedureFS = new Shader(gl, gl.FRAGMENT_SHADER, "procedure_fs.essl");

  this.trianglePosition = new Vec3(0,0,0);
  this.trianglePosition1 = new Vec3(0,0.5,0);

  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TexturedProgram(gl, this.textureVS, this.textureFS);
  this.procedureProgram = new Program(gl, this.textureVS, this.procedureFS);

  this.triangleGeometry = new TriangleGeometry(gl);
  this.quadGeometry = new QuadGeometry(gl);
  this.smallQuadGeometry = new SmallQuadGeometry(gl);
  this.timeAtLastFrame = new Date().getTime();
  this.rotatescale = 0.2;
  this.sizescale = new Vec3(1,1,0);

  this.material = new Material(gl, this.solidProgram);
  this.material.solidColor.set(0, 0, 0);
  this.mesh = new Mesh(this.triangleGeometry, this.material);

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

  this.slowpokeArray = [];
  for (var i = 0; i < 3; i++) {
      this.slowpokeArray[i] = new GameObject(this.marbleMesh);
      this.slowpokeArray[i].position.set(this.slowpoke.position).add(Math.random() * 1000 - 500, 0, Math.random() * 1000 - 500);
  }
  this.slowpokeSafe = [];
  for (var i = 0; i < this.slowpokeArray.length; i++) {
      this.slowpokeSafe[i] = 0;
  }

  this.heliTexture = new Material(gl, this.textureProgram);
  this.heliTexture.colorTexture.set(new Texture2D(gl, "json/heli/heliait.png"));

  this.heliMaterials = [this.heliTexture];

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
  this.boxMaterial = new Material(gl, this.textureProgram);
  this.boxMaterial.colorTexture.set(new Texture2D(gl, "json/devang.png"));
  this.boxMesh = new Mesh(this.smallQuadGeometry, this.boxMaterial);
  this.box = [];

  this.box[0] = new GameObject(this.boxMesh);
  this.box[0].position.add(0, 1.5, 0);
  this.box[1] = new GameObject(this.boxMesh);
  this.box[1].orientation = Math.PI / 2;
  this.box[1].rotateAxis = new Vec3(1, 0, 0);
  this.box[1].position.add(0,50,50);
  this.box[2] = new GameObject(this.boxMesh);
  this.box[2].orientation = Math.PI / 2;
  this.box[2].rotateAxis = new Vec3(0,0,1);
  this.box[2].position.add(50, 50, 0);
  this.box[3] = new GameObject(this.boxMesh);
  this.box[3].orientation = Math.PI / 2;
  this.box[3].rotateAxis = new Vec3(0,0,1);
  this.box[3].position.add(-50, 50, 0);
  this.box[4] = new GameObject(this.boxMesh);
  this.box[4].orientation = Math.PI / 2;
  this.box[4].rotateAxis = new Vec3(1,0,0);
  this.box[4].position.add(0, 50, -50);

  this.arrowMaterial = new Material(gl, this.textureProgram);
  this.arrowMaterial.colorTexture.set(new Texture2D(gl, "slowpoke/YadonDh.png"));
  this.arrowMesh = new Mesh(this.triangleGeometry, this.arrowMaterial);
  this.arrow = new GameObject(this.arrowMesh);
  this.arrow.rotateAxis = new Vec3(1,0,0);
  this.arrow.orientation = Math.PI / 2;
  this.arrow.position.set(this.heli.position).add(0, 50, 0);
  this.arrowDirection = new Vec3(1,0,0);

  this.camera = new PerspectiveCamera();

  this.lightSources = {};
  this.lightSources.pos = new Vec4Array(3);
  this.lightSources.pos.at(0).set(-3,1,3,0);
  this.lightSources.pos.at(1).set(this.heli.position.x, this.heli.position.y, this.heli.position.z, 1);

  this.lightSources.dir = new Vec3(0, -1, 0);

  this.lightSources.power = new Vec3Array(3);
  this.lightSources.power.at(0).set(20,20,20);
  this.lightSources.power.at(1).set(10000,10000,10000);

  // Game stuff
  this.pickup = new GameObject(this.marbleMesh);
  this.pickup.position.y = 0;
  this.isPicked = false;
  this.done = false;
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
  this.pickup = this.pickupSlowpoke(timeAtThisFrame, keysPressed);
  if (!this.isPicked) {
      this.pickup = new GameObject(this.marbleMesh);
  }
  this.heli.child.updatePos(this.heli.position);
  this.heli.childShadow.updatePos(this.heli.position);

  //this.slowpoke.draw(this.camera, this.lightSources);
  //this.slowpokeShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);

  this.heli.draw(this.camera, this.lightSources);
  this.heliShadow.position.set(this.heli.position);
  this.heliShadow.orientation = this.heli.orientation;
  if (!this.done)
    this.arrow.draw(this.camera, this.lightSources);
  this.heliShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);
  this.heli.child.orientation += .5;
  this.heli.childShadow.orientation += .5;
  this.heli.child.draw(this.camera, this.lightSources);
  this.heli.childShadow.shadowDraw(this.lightSources.pos.at(0), this.camera);
  this.ground.draw(this.camera, this.lightSources);
  for (var i = 1; i < this.box.length; i++)
    this.box[i].draw(this.camera, this.lightSources);
/*
  for (var i = 0; i < this.treeArray.length; i++) {
      this.treeArray[i].draw(this.camera, this.lightSources);
  }
*/

  for (var i = 0; i < this.slowpokeArray.length; i++) {
      this.slowpokeArray[i].gravity(timeAtThisFrame);
      this.slowpokeArray[i].draw(this.camera, this.lightSources);
  }
  this.updateSlowpokeStatus();
  this.updatePointLight();
  this.updateArrow();
  this.camera.move(this.timeAtLastFrame, keysPressed, this.heli);

  gl.enable(gl.DEPTH_TEST);
  this.solidProgram.commit();
};

Scene.prototype.updatePointLight = function() {
    this.lightSources.pos.at(1).set(this.heli.position.x, this.heli.position.y - 1, this.heli.position.z, 1);
};

Scene.prototype.pickupSlowpoke = function (t, keysPressed) {
    var candidate = this.pickup;
    if (!this.isPicked) {
        for (var i = 0; i < this.slowpokeArray.length; i++) {
            var diff = new Vec3().setDifference(this.slowpokeArray[i].position, this.heli.position);
            if (Math.abs(Math.floor(diff.x)) <= 10 && Math.abs(Math.floor(diff.z)) <= 10 && Math.floor(diff.y) <= 10) {
                candidate = this.slowpokeArray[i];
            }
        }
    }
    if (keysPressed.P) {
        this.isPicked = true;
        candidate.picked = true;
        candidate.position.set(new Vec3(this.heli.position.x, this.heli.position.y - 5, this.heli.position.z));
        return candidate;
    }
    if (this.isPicked)
        candidate.timeOfDrop = t;
    this.isPicked = false;
    candidate.picked = false;
    return candidate;
};

Scene.prototype.selectSlowpoke = function () {
    for (var i = 0; i < this.slowpokeArray.length; i++) {
        if (this.slowpokeSafe[i] == 0)
            return this.slowpokeArray[i];
    }
    if (!this.done) {
        console.log("DEVANG: Thanks for finding all of my Slowpokes! :)");
        this.done = true;
    }
    return this.box[0];
};

Scene.prototype.updateSlowpokeStatus = function() {
    for (var i = 0; i < this.slowpokeArray.length; i++) {
        let curr = this.slowpokeArray[i];
        if (curr.position.x < 2050 && curr.position.x > 1950 &&
            curr.position.z < 2050 && curr.position.z > 1950)
                this.slowpokeSafe[i] = 1;
    }
};

Scene.prototype.updateArrow = function() {
    this.arrow.position.set(this.heli.position).add(0, 50, 0);
    let dest = new Vec3();
    let twoDimArrowPos = new Vec3(this.arrow.position).mul(1,0,1);

    if (this.isPicked)
        dest.set(this.box[0].position).mul(1,0,1);
    else {
        dest.set(this.selectSlowpoke().position).mul(1, 0, 1);
    }

    let dist = new Vec3(dest).sub(twoDimArrowPos);

    let cos = this.arrowDirection.dot(dist.normalize());

    if (this.heli.position.z < dest.z)
        this.arrow.orientation = -Math.acos(cos);
    else
        this.arrow.orientation = Math.acos(cos);

    this.arrow.rotateAxis = new Vec3(0,0,1);
};
