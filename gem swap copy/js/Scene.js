"use strict";

let Scene = function(gl) {
  // initialize shaders, program, camera, time variable
  this.vsIdle  = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.camera = new OrthoCamera();
  this.timeAtLastFrame = new Date().getTime();

  // geometries used for game objects
  this.triangleGeometry = new TriangleGeometry(gl);
  this.quadGeometry     = new QuadGeometry(gl);
  this.starGeometry     = new StarGeometry(gl);
  this.heartGeometry    = new HeartGeometry(gl);
  this.funGeometry      = new FunGeometry(gl);

  // materials used for game objects
  this.redMaterial = new Material(gl, this.solidProgram);
  this.redMaterial.solidColor.set(1, 0, 0);
  this.greenMaterial = new Material(gl, this.solidProgram);
  this.greenMaterial.solidColor.set(0, 0.5, 0);
  this.blueMaterial = new Material(gl, this.solidProgram);
  this.blueMaterial.solidColor.set(0, 0, 1);
  this.yellowMaterial = new Material(gl, this.solidProgram);
  this.yellowMaterial.solidColor.set(1, 1, 0);
  this.pinkMaterial = new Material(gl, this.solidProgram);
  this.pinkMaterial.solidColor.set(0.69, 0.420, 0.74);

  // meshes used for game objects
  this.starMesh  = new Mesh(this.starGeometry, this.yellowMaterial);
  this.heartMesh = new Mesh(this.heartGeometry, this.redMaterial);
  this.greenMesh = new Mesh(this.funGeometry, this.greenMaterial);
  this.blueMesh  = new Mesh(this.triangleGeometry, this.blueMaterial);
  this.pinkMesh  = new Mesh(this.quadGeometry, this.pinkMaterial);

  // used to store game objects
  this.objectArray = [];

  // for executing events
  this.bPressed = false;
  this.swapped = false;

  // generates a random game object
  this.randomGameObject = function (currObject) {
      let random = Math.random();
      if (random < 0.2) {
          currObject = new GameObject(this.heartMesh);
          currObject.mesh.objectType = "heart";
      } else if (random < 0.4) {
          currObject = new GameObject(this.greenMesh);
          currObject.mesh.objectType = "green";
      } else if (random < 0.6) {
          currObject = new GameObject(this.blueMesh);
          currObject.mesh.objectType = "blue";
      } else if (random < 0.8) {
          currObject = new GameObject(this.starMesh);
          currObject.mesh.objectType = "star";
      } else {
          currObject = new GameObject(this.pinkMesh);
          currObject.mesh.gyro = true;
          currObject.mesh.objectType = "gyro";
      }
      return currObject;
  };

  // initial creation of game objects
  for (let i = 0; i < 10; i++) {
      this.objectArray[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
          this.objectArray[i][j] = this.randomGameObject(this.objectArray[i][j]);
          this.objectArray[i][j].position = new Vec3(i,j,0);
    }
  }

  /* ---------------functions executing features of the game--------------- */

  // performs the bomb function, which toggles a boolean for use when drawing
  // the objects
  this.bomb = function (vec) {
      if (this.bPressed)
        this.objectArray[Math.round(vec.x)][Math.round(vec.y)].noDraw = true;
  };

  // performs the quake function, which shakes the screen and gives gems a
  // 0.1% chance of disappearing
  this.quake = function (timeAtThisFrame) {
      this.camera.shake(timeAtThisFrame);
      for (let i = 0; i < this.objectArray.length; i++) {
          for (let j = 0; j < this.objectArray[i].length; j++) {
              if (!this.objectArray[i][j].noDraw) {
                let random = Math.random();
                if (random <= 0.001)
                  this.objectArray[i][j].noDraw = true;
              }
          }
      }
  }

  // determines if there are three game objects of the same type in a row
  this.threeInARow = function (x, y) {
    if (x == 9) {
        return (this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType  &&
                this.objectArray[x][y].mesh.objectType === this.objectArray[x-2][y].mesh.objectType);
    } else if (x == 8) {
        return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType) ||
               (this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType  &&
                this.objectArray[x][y].mesh.objectType === this.objectArray[x-2][y].mesh.objectType));
    } else if (x == 0) {
        return (this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                this.objectArray[x][y].mesh.objectType === this.objectArray[x+2][y].mesh.objectType);
    } else if (x == 1) {
        return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                 this.objectArray[x][y].mesh.objectType === this.objectArray[x+2][y].mesh.objectType) ||
                (this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                 this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType));
    }
    else {
        return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                 this.objectArray[x][y].mesh.objectType === this.objectArray[x+2][y].mesh.objectType) ||
                (this.objectArray[x][y].mesh.objectType === this.objectArray[x+1][y].mesh.objectType  &&
                 this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType) ||
                (this.objectArray[x][y].mesh.objectType === this.objectArray[x-1][y].mesh.objectType  &&
                 this.objectArray[x][y].mesh.objectType === this.objectArray[x-2][y].mesh.objectType));
    }
  };

  // determines if there are three game objects of the same type in a col
  this.threeInACol = function (x, y) {
    if (y == 9) {
      return (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType  &&
              this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-2].mesh.objectType);
    } else if (y == 8) {
      return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType) ||
              (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-2].mesh.objectType));
    } else if (y == 0) {
      return (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
              this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+2].mesh.objectType);
    } else if (y == 1) {
      return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+2].mesh.objectType) ||
              (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType));
    } else {
      return ((this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+2].mesh.objectType) ||
              (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y+1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType) ||
              (this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-1].mesh.objectType  &&
               this.objectArray[x][y].mesh.objectType === this.objectArray[x][y-2].mesh.objectType));
    }
  };

  // boolean that determines if a swap is ok
  this.inBounds = function (x1, y1, x2, y2) {
      return ((x2 - x1 == 1 && x1 != 9 && Math.abs(y2 - y1) == 0)  ||
              (x2 - x1 == -1 && x1 != 0 && Math.abs(y2 - y1) == 0) ||
              (y2 - y1 == 1 && y1 != 9 && Math.abs(x2 - x1) == 0)  ||
              (y2 - y1 == -1 && y1 != 0 && Math.abs(x2 - x1) == 0));
  };

  // decides if there are 3 game objects of the same type in a row
  this.legal = function (x1, y1, x2, y2) {
      let result = false;
      if (this.threeInARow(x1, y1) || this.threeInACol(x1, y1)) {
          result = true;
      }
      else if (this.threeInARow(x2, y2) || this.threeInACol(x2, y2)) {
          result = true;
      }
      return result;
  };

  // outer function for the swap operation
  this.swap = function (posvec, prevMousePos){
      let x1 = Math.round(prevMousePos.x);
      let y1 = Math.round(prevMousePos.y);
      let x2 = Math.round(posvec.x);
      let y2 = Math.round(posvec.y);

      // checks if the swap is in within the board and between proper elements
      if (this.inBounds(x1, y1, x2, y2)) {
          this.swapHelp(x1, y1, x2, y2);
          if (!this.legal(x1, y1, x2, y2))
              this.swapHelp(x2, y2, x1, y1);
      }
  };

  // swaps the apperances of two game objects with positions (x1,y1) and (x2,y2)
  this.swapHelp = function (x1, y1, x2, y2) {
      let temp = this.objectArray[x1][y1].mesh;
      this.objectArray[x1][y1].mesh = this.objectArray[x2][y2].mesh;
      this.objectArray[x2][y2].mesh = temp;
  };

  // for the sticky feature, which causes game objects to follow the mouse's
  // movements while clicked
  this.moveMouse = function (prevMousePos, posvec) {
      let x = Math.round(prevMousePos.x);
      let y = Math.round(prevMousePos.y);
      if (x < 10 && x >= 0 && y < 10 && y >= 0)
        this.objectArray[x][y].position.set(posvec);
  };

  // resets the position of a dragged object, returning it to its proper
  // position in the grid
  this.resetPos = function (prevMousePos) {
      let x = Math.round(prevMousePos.x);
      let y = Math.round(prevMousePos.y);
      let temp = new Vec4(x, y, 0, 1);
      if (x < 10 && x >= 0 && y < 10 && y >= 0)
        this.objectArray[x][y].position.set(temp);
  };

  // attempt at the 3 in a line feature
  this.threeInALineY = function(count, i, j) {
      console.log(i + "," + count);
      for (var k = 0; k < count; k++) {
         this.objectArray[i][j-k].noDraw = true;
      }
  };

  // attempt at the 3 in a line feature
  this.threeInALineX = function(color, i, j) {
      for (var k = 0; k < color.count; k++) {
          this.objectArray[i-k][j].noDraw = true;
      }
  };

  // performs the dramatic exit feature, which apply changes to a game object's
  // size and orientation for drawing in the next frame
  this.dramaticExit = function(x,y) {
      let currObject = this.objectArray[x][y];
      if (currObject.scale.x <= 0.01 || currObject.scale.y <= 0.01)
        return true;
      currObject.scale.sub(new Vec3(0.15, 0.15, 0));
      currObject.orientation += 0.3;
      return false;
  };

  // skyfall feature - if an object disappears, the objects above it fall into
  // the place below, adding a random game object to the top row
  this.skyfall = function (i, j) {
      for (var k = j; k < 10; k++) {
          if (k == 9) {
              var temp = new Vec3(this.objectArray[i][k].position);
              this.objectArray[i][k] = this.randomGameObject(this.objectArray[i][k]);
              this.objectArray[i][k].position = temp;
          } else {
              this.objectArray[i][k].mesh = this.objectArray[i][k+1].mesh;
          }
      }
  };

  // for handling keyboard input
  this.keyboardHandling = function (keysPressed, timeAtThisFrame) {
      // turn the tables feature, rotates the camera
      if (keysPressed.A) {
        this.camera.rotation += -0.1;
        this.camera.updateViewProjMatrix();
      }
      if (keysPressed.D) {
        this.camera.rotation += 0.1;
        this.camera.updateViewProjMatrix();
      }

      // quake feature, shakes the camera and causes gems to disappear
      if (keysPressed.Q) {
        this.quake(timeAtThisFrame);
      }

      // toggles a switch which is used in the bomb function
      if (keysPressed.B)
          this.bPressed = true;
      else
          this.bPressed = false;
  };

  this.color_array_init = function () {
      let colorArray = [];

      for (var i = 0; i < 10; i++) {
          colorArray.push({obj: this.objectArray[0][i].mesh.objectType,
                             count: 0});
      }
      return colorArray
  }

  // for printing the game objects, taking any commands into account
  this.printScene = function() {
      let curColorX = this.color_array_init();
      for (var i = 0; i < this.objectArray.length; i++) {
        let curColorY = this.objectArray[i][0].mesh.objectType;
        let curColorCountY = 0;
        let skyfallStack = [];

        for (var j = 0; j < 10; j++) {
            let currObject = this.objectArray[i][j];
            // object has completed it's exit animation, skyfall feature
            if (currObject.objectGone) {
                skyfallStack.push(j);
                //currObject.noDraw = false;
                //currObject.objectGone = false;
            }
            // gyro feature
            if (currObject.mesh.gyro)
              currObject.orientation += 0.03;
            else if (!currObject.noDraw) {
              currObject.orientation = 0;
            }

        // this next commented-out section is my attempt at the 3 in a line
        // feature. The first block is less buggy than the second -
        // activate at your own risk!
/*
            // three in a line feature
            if (currObject.mesh.objectType === curColorY) {
                curColorCountY++;
                if (j == 9 && curColorCountY >= 3) {
                    this.threeInALineY(curColorCountY, i, j);
                //    curColorCountY = 0;
                }
            } else if (currObject.mesh.objectType !== curColorY) {
                curColorY = currObject.mesh.objectType;
                if (curColorCountY >= 3) {
                    this.threeInALineY(curColorCountY, i, j-1);
                }
                curColorCountY = 1;
            }
*/
/*
            if (currObject.mesh.objectType === curColorX[j].obj) {
                curColorX[j].count++;
                if (i == 9 && curColorX[j].count >= 3) {
                    this.threeInALineX(curColorX[j], i, j);
                    curColorX[j].count = 0;
                }
            } else {
                curColorX[j].obj = currObject.mesh.objectType;
                if (curColorX[j].count >= 3) {
                    this.threeInALineX(curColorX[j], i-1, j);
                }
                curColorX[j].count = 1;
            }
*/

            // dramatic exit feature
            if (currObject.noDraw) {
                currObject.objectGone = this.dramaticExit(i, j);
            }
        }
        for (var k = 0; k < skyfallStack.length; k++) {
            var temp = skyfallStack.pop();
            this.skyfall(i, temp);
            this.objectArray[i][temp].objectReset();
        }
    }
    for (var c = 0; c < this.objectArray.length; c++) {
        for (var d = 0; d < 10; d++) {
            this.objectArray[c][d].draw(this.camera);
        }
    }
  };
};

// updates the scene
Scene.prototype.update = function(gl, keysPressed) {
  // handles time differences between frames
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0, 0, 0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // pulsating heart
  this.redMaterial.time.add(2 * dt);

  this.solidProgram.commit();

  this.keyboardHandling(keysPressed, timeAtThisFrame);
  this.printScene();
};
