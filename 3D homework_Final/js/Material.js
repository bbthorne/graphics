let Material = function(gl, program) {
  this.gl = gl;
  this.program = program;
  let theMaterial = this;
  Object.keys(program.uniforms).forEach(function(uniformName) {
    let uniform = program.uniforms[uniformName];
    let reflectionVariable =
        UniformReflectionFactories.makeVar(gl,
                                uniform.type, uniform.size, uniform.textureUnit);
    if (!Material[uniformName]) {
    Object.defineProperty(theMaterial, uniformName,
				{value: reflectionVariable} );
    }
  });
};

Material.prototype.commit = function() {
  let gl = this.gl;
  this.program.commit();
  let theMaterial = this;
  Object.keys(this.program.uniforms).forEach( function(uniformName) {
    let uniform = theMaterial.program.uniforms[uniformName];
    let reflectionVariable = Material[uniformName] || theMaterial[uniformName];
    reflectionVariable.commit(gl, uniform.location);
  });
};

Object.defineProperty(Material, "modelViewProjMatrix", {value: new Mat4()});
Material.lightSources = new Vec4Array(3);
Material.lightPowerDensity = new Vec3Array(3);
Material.lightMainDir = new Vec3();
Material.modelMatrix = new Mat4();
Material.modelMatrixInverse = new Mat4();
Material.direction = new Vec3();
Material.projectToPlane = new Mat4();
