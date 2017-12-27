let Material = function(gl, program) {
  this.gl = gl;
  this.program = program;
  let theMaterial = this;
  Object.keys(program.uniforms).forEach(function(uniformName) {
    let uniform = program.uniforms[uniformName];
    let reflectionVariable =
        UniformReflectionFactories.makeVar(gl,
                                uniform.type, uniform.size);
    Object.defineProperty(Material, "modelViewProjMatrix", {value: new Mat4()} );
    Object.defineProperty(Material, "lightSources", {value: new Vec4()});
    this.time = 0;
  });
};

Material.prototype.commit = function() {
  let gl = this.gl;
  this.program.commit();
  let theMaterial = this;
  Object.keys(this.program.uniforms).forEach( function(uniformName) {
    let uniform = theMaterial.program.uniforms[uniformName];
    //theMaterial[uniformName].commit(gl, uniform.location);
    let reflectionVariable = Material[uniformName] || theMaterial[uniformName];
    reflectionVariable.commit(gl, uniform.location);
  });
};
