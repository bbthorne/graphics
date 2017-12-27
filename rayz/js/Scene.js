"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  this.textureVS = new Shader(gl, gl.VERTEX_SHADER, "texture_vs.essl");
  this.textureFS = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");

  this.procedureFS = new Shader(gl, gl.FRAGMENT_SHADER, "procedure_fs.essl");

  this.shinyVS = new Shader(gl, gl.VERTEX_SHADER, "shiny_vs.essl");
  this.shinyFS = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");

  this.trianglePosition = new Vec3(0,0,0);
  this.trianglePosition1 = new Vec3(0,0.5,0);

  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TexturedProgram(gl, this.textureVS, this.textureFS);
  this.procedureProgram = new Program(gl, this.textureVS, this.procedureFS);
  this.shinyProgram = new TexturedProgram(gl, this.shinyVS, this.shinyFS);

  this.shinyMaterial = new Material(gl, this.shinyProgram);
  this.shinyMaterial.probeTexture.set(new Texture2D(gl, "envmaps/probe2017fall1.png"));
  this.shinyMaterial1 = new Material(gl, this.shinyProgram);
  this.shinyMaterial1.probeTexture.set(new Texture2D(gl, "envmaps/probe2017fall2.png"));

  this.backgroundGeometry = new BackgroundGeometry(gl);
  this.backgroundMesh = new Mesh(this.backgroundGeometry, this.shinyMaterial);
  this.backgroundOb = new GameObject(this.backgroundMesh);

  this.pawnHead = new ClippedQuadric(new Mat4(), new Mat4());
  this.pawnBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.pawnNeck = new ClippedQuadric(new Mat4(), new Mat4());

  this.shape3 = new ClippedQuadric(new Mat4(), new Mat4());
  this.crown = new ClippedQuadric(new Mat4(), new Mat4());
  this.kingBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.kingNeck = new ClippedQuadric(new Mat4(), new Mat4());

  this.bishopBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.bishopNeck = new ClippedQuadric(new Mat4(), new Mat4());
  this.cylinderCheck = new ClippedQuadric(new Mat4(), new Mat4());

  this.bishopHead = new ClippedQuadric(new Mat4(), new Mat4());

  this.board = new ClippedQuadric(new Mat4(), new Mat4());

  this.queen = new ClippedQuadric(new Mat4(), new Mat4());

  this.rookHead1 = new ClippedQuadric(new Mat4(), new Mat4());
  this.rookBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.rookHead2 = new ClippedQuadric(new Mat4(), new Mat4());

  this.pawnHead.setUnitSphere();
  this.pawnHead.transform(new Mat4().translate(0,0.8,0));

  this.pawnBody.setUnitCone();
  this.pawnBody.transform(new Mat4().scale(1, 2, 1));


  this.shape3.fillParabaloidHole();
  this.shape3.transform(new Mat4().scale(1.2, 1.2, 1.2).translate(8, 3.7, 10));


  this.pawnNeck.setUnitSphere();
  this.pawnNeck.transform(new Mat4().scale(1.2, 0.3, 1.2).translate(0, -0.4, 0));

  this.crown.setParabaloid();
  this.crown.transform(new Mat4().scale(1.2, 1.2, 1.2).translate(8, 2.5, 10));

  this.kingBody.setUnitCone();
  this.kingBody.transform(new Mat4().scale(1.2, 3.5, 1.2).translate(8, 2.5, 10));

  this.kingNeck.setUnitSphere();
  this.kingNeck.transform(new Mat4().scale(2, 0.5, 2).translate(8, 2.3, 10));

  this.bishopBody.setUnitCone();
  this.bishopBody.transform(new Mat4().scale(1,3,1).translate(-4, 1.8, 0));

  this.bishopNeck.setUnitSphere();
  this.bishopNeck.transform(new Mat4().scale(1.2, 0.3, 1.2).translate(-4, 1.7, 0));

  this.cylinderCheck.setUnitCylinder();
  this.cylinderCheck.transform(new Mat4().scale(0.5, 0.5, 0.5).translate(10, 0 , 0));

  this.queen.setUnitHyperboloid();
  this.queen.transform(new Mat4().scale(1.2, 3.5, 1.2).translate(5, 0, -5));

  this.rookHead1.setParabaloid();
  this.rookHead1.clipperCoeffMatrix2.set(new Mat4().set(1, 0, 0, 0,
                                                        0, 0, 0, 0,
                                                        0, 0, 0, 0,
                                                        0, 0, 0, -1));
  this.rookHead1.transform(new Mat4().scale(1.5, 1.5, 1.5).translate(-7, -1, -11));

  this.rookHead2.setParabaloid();
  this.rookHead2.transform(new Mat4().scale(1.5, 1.5, 1.5).translate(-10, -1, -10));

  this.rookBody.setUnitHyperboloid();
  this.rookBody.transform(new Mat4().scale(1.2, 2,1.2).translate(-7, -1, -11));

  // MULTI CLIPPED
  this.bishopHead.setUnitSphere();
  this.bishopHead.transform(new Mat4().scale(0.75, 2, 0.75).translate(-4, 3.5, 0));

  this.board.setBoard();
  this.board.transform(new Mat4().translate(0, -3.2, 0));

  this.camera = new PerspectiveCamera();

  this.lightSources = {};
  this.lightSources.pos = new Vec4Array(3);
  this.lightSources.pos.at(0).set(1,2.5,1,0);

  this.lightSources.dir = new Vec3(0, 1, 0);

  this.lightSources.power = new Vec3Array(3);
  this.lightSources.power.at(0).set(4,4,4);
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

  this.backgroundOb.draw(this.camera, this.lightSources);

  // 1 CLIP

  this.pawnHead.transform(new Mat4().translate(0.2 * Math.pow(Math.sin(timeAtThisFrame/1000), 3), 0, 0.5 * Math.pow(Math.cos(timeAtThisFrame/1000), 3)));
  Material.quadrics.at(0).set(this.pawnHead.surfaceCoeffMatrix);
  Material.quadrics.at(1).set(this.pawnHead.clipperCoeffMatrix);
  Material.brdfs.at(0).set(10,1,1,0);

  this.pawnBody.transform(new Mat4().translate(0.2 * Math.pow(Math.sin(timeAtThisFrame/1000), 3), 0, 0.5 * Math.pow(Math.cos(timeAtThisFrame/1000), 3)));
  Material.quadrics.at(2).set(this.pawnBody.surfaceCoeffMatrix);
  Material.quadrics.at(3).set(this.pawnBody.clipperCoeffMatrix);
  Material.brdfs.at(1).set(10,1,1,0);

  Material.quadrics.at(4).set(this.shape3.surfaceCoeffMatrix);
  Material.quadrics.at(5).set(this.shape3.clipperCoeffMatrix);
  Material.brdfs.at(2).set(1,1,8,0);

  this.pawnNeck.transform(new Mat4().translate(0.2 * Math.pow(Math.sin(timeAtThisFrame/1000), 3), 0, 0.5 * Math.pow(Math.cos(timeAtThisFrame/1000), 3)));
  Material.quadrics.at(6).set(this.pawnNeck.surfaceCoeffMatrix);
  Material.quadrics.at(7).set(this.pawnNeck.clipperCoeffMatrix);
  Material.brdfs.at(3).set(10,2,1,0);

  Material.quadrics.at(8).set(this.crown.surfaceCoeffMatrix);
  Material.quadrics.at(9).set(this.crown.clipperCoeffMatrix);
  Material.brdfs.at(4).set(1, 1, 8,1);

  Material.quadrics.at(10).set(this.kingBody.surfaceCoeffMatrix);
  Material.quadrics.at(11).set(this.kingBody.clipperCoeffMatrix);
  Material.brdfs.at(5).set(1, 1, 8,1);

  Material.quadrics.at(12).set(this.kingNeck.surfaceCoeffMatrix);
  Material.quadrics.at(13).set(this.kingNeck.clipperCoeffMatrix);
  Material.brdfs.at(6).set(1, 1, 8,1);

  this.queen.transform(new Mat4().translate(0.2 * Math.sin(timeAtThisFrame/1000), 0, 0.2 * Math.cos(timeAtThisFrame/1000)));
  Material.quadrics.at(14).set(this.queen.surfaceCoeffMatrix);
  Material.quadrics.at(15).set(this.queen.clipperCoeffMatrix);
  Material.brdfs.at(7).set(4,4,2,4);

  // MULTI CLIPPED
  Material.multiClipQuad.at(0).set(this.rookHead1.surfaceCoeffMatrix);
  Material.multiClipQuad.at(1).set(this.rookHead1.clipperCoeffMatrix);
  Material.multiClipQuad.at(2).set(this.rookHead1.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(0).set(1, 8, 1, 2);

  Material.multiClipQuad.at(3).set(this.rookBody.surfaceCoeffMatrix);
  Material.multiClipQuad.at(4).set(this.rookBody.clipperCoeffMatrix);
  Material.multiClipQuad.at(5).set(new Mat4().set(0, 0, 0, 0,
                                                  0, 0, 0, 0,
                                                  0, 0, 0, 0,
                                                  0, 0, 0, -1));
  Material.multiClipBrdfs.at(1).set(1, 8, 1, 2);
/*
  Material.multiClipQuad.at(6).set(this.rookHead2.surfaceCoeffMatrix);
  Material.multiClipQuad.at(7).set(this.rookHead2.clipperCoeffMatrix);
  Material.multiClipQuad.at(8).set(new Mat4().set(1, 0, 0, 1,
                                                  0, 0, 0, 0,
                                                  0, 0, 1, 0,
                                                  0, 0, 0, -0.9)
                                              .translate(-10, -1, -10));
  Material.multiClipBrdfs.at(2).set(1, 8, 1, 2);
*/
  Material.multiClipQuad.at(6).set(this.board.surfaceCoeffMatrix);
  Material.multiClipQuad.at(7).set(this.board.clipperCoeffMatrix);
  Material.multiClipQuad.at(8).set(new Mat4().set(0, 0, 0, 0,
                                                  0, 0, 0, 0,
                                                  0, 0, 1, 0,
                                                  0, 0, 0, -256));
  Material.multiClipBrdfs.at(2).set(0,0,0,3);

//  this.updatePointLight();

  this.camera.move(this.timeAtLastFrame, keysPressed, this.heli, dt);

  gl.enable(gl.DEPTH_TEST);
  this.solidProgram.commit();
};

Scene.prototype.updatePointLight = function() {
    this.lightSources.pos.at(1).set(this.heli.position.x, this.heli.position.y - 1, this.heli.position.z, 1);
}
