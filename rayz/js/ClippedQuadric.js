let ClippedQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix) {
    this.surfaceCoeffMatrix = surfaceCoeffMatrix;
    this.clipperCoeffMatrix = clipperCoeffMatrix;
    this.clipperCoeffMatrix2 = new Mat4().set(0, 0, 0, 0,
                                              0, 0, 0, 0,
                                              0, 0, 0, 0,
                                              0, 0, 0, 0);
}

ClippedQuadric.prototype.setUnitSphere = function(){
    this.surfaceCoeffMatrix.set(1, 0, 0, 0,
		                        0, 1, 0, 0,
		                        0, 0, 1, 0,
		                        0, 0, 0, -1);

    this.clipperCoeffMatrix.set(0, 0, 0, 0,
		                        0, 0, 0, 0,
		                        0, 0, 0, 0,
		                        0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCone = function() {
    this.surfaceCoeffMatrix.set(1, 0, 0, 0,
                                0, -1, 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, 0);

    this.clipperCoeffMatrix.set(0, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -1).translate(0,-1,0);
}

ClippedQuadric.prototype.setUnitHyperboloid = function() {
    this.surfaceCoeffMatrix.set(1, 0, 0, 0,
                                0, -1, 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, -1);
    this.clipperCoeffMatrix.set(0, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCylinder = function() {
    this.surfaceCoeffMatrix.set(1, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -1);

    this.clipperCoeffMatrix.set(0, 0, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, -1);
}

ClippedQuadric.prototype.fillCylinderHoles = function() {
    this.surfaceCoeffMatrix.set(0, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -1);

    this.clipperCoeffMatrix.set(1, 0, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, -1);
}

ClippedQuadric.prototype.setParabaloid = function() {
    this.surfaceCoeffMatrix.set(1, 0, 0, 0,
                                0, 0, 0, -1,
                                0, 0, 1, 0,
                                0, 0, 0, 0);

    this.clipperCoeffMatrix.set(0, 0, 0, 0,
                                0, 0, 0, 1,
                                0, 0, 0, 0,
                                0, 0, 0, -2);
}

ClippedQuadric.prototype.fillParabaloidHole = function () {
    this.surfaceCoeffMatrix.set(0, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -1);

    this.clipperCoeffMatrix.set(1, 0, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, -2);

}

ClippedQuadric.prototype.setBoard = function() {
    this.surfaceCoeffMatrix.set(0, 0, 0, 0,
                                0, 1, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -0.01);

    this.clipperCoeffMatrix.set(1, 0, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, 0,
                                0, 0, 0, -256);
}

ClippedQuadric.prototype.transform = function (T) {
    var inverseT = new Mat4(T).invert();
    var transposeT = new Mat4(inverseT).transpose();
    this.surfaceCoeffMatrix.premul(inverseT).mul(transposeT);
    this.clipperCoeffMatrix.premul(inverseT).mul(transposeT);
    this.clipperCoeffMatrix2.premul(inverseT).mul(transposeT);
}
