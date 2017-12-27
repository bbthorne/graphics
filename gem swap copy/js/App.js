// App constructor
let App = function(canvas, overlay) {
	this.canvas = canvas;
	this.overlay = overlay;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		throw new Error("Browser does not support WebGL");

	}
    this.scene = new Scene(this.gl);
	this.resize();

	this.gl.pendingResources = {};

    this.keysPressed = {};
    this.mouseClick = false;
    this.prevMousePos = new Vec4(0,0,0,0);

    // gives transformed coordinates to use in mouse commands
    this.setMouseCoords = function (event) {
        var x = (event.clientX / canvas.width - 0.5) * 2;
        var y = (event.clientY / canvas.height - 0.5) * -2;
        vec = new Vec4(x, y, 0, 1);
        mat = new Mat4(this.scene.camera.viewProjMatrix).invert();
        return vec.mul(mat);
    }
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.scene.camera.setAspectRatio(this.canvas.clientWidth / this.canvas.clientHeight);
};

App.prototype.registerEventHandlers = function() {
	let theApp = this;
	document.onkeydown = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};
	document.onkeyup = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	this.canvas.onmousedown = function(event) {
        let pos = theApp.setMouseCoords(event);
        theApp.scene.bomb(pos);
        if (!theApp.mouseClick)
            theApp.prevMousePos.set(pos);
        theApp.mouseClick = true;
	};
	this.canvas.onmousemove = function(event) {
        if (theApp.mouseClick) {
            pos = theApp.setMouseCoords(event);
            theApp.scene.moveMouse(theApp.prevMousePos, pos);
        }
		event.stopPropagation();
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
	};
	this.canvas.onmouseup = function(event) {
        if (theApp.mouseClick) {
            pos = theApp.setMouseCoords(event);
            theApp.scene.swap(pos, theApp.prevMousePos);
            theApp.scene.resetPos(theApp.prevMousePos);
            theApp.prevMousePos.set(pos);
        }
        theApp.mouseClick = false;
	};
	window.addEventListener('resize', function() {
		theApp.resize();
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// animation frame update
App.prototype.update = function() {

	let pendingResourceNames = Object.keys(this.gl.pendingResources);
	if (pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed);
		this.overlay.innerHTML = "Ready.";
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	let theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {
	let canvas = document.getElementById("canvas");
	let overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	let app = new App(canvas, overlay);
	app.registerEventHandlers();
});
