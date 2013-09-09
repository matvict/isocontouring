 function QuadGeometry(gl)
{
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.BindVBO();     
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([ -1., -1.,   1., -1.,    -1.,  1.,     1., -1.,    1.,  1.,    -1.,  1.]),
      gl.STATIC_DRAW);
}
QuadGeometry.prototype.BindVBO = function() 
{    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer); 
};
QuadGeometry.prototype.SetPositionAttribute = function(attr_position)
{     
    this.BindVBO();    
    this.attr_position = attr_position;
    this.gl.vertexAttribPointer(attr_position, 2, this.gl.FLOAT, false, 0, 0);
}
QuadGeometry.prototype.Draw = function()
{
    this.BindVBO();
    var gl = this.gl;
    gl.vertexAttribPointer(this.attr_position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attr_position);     
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(this.attr_position);     
}