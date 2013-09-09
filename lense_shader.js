// Copyright (c) 2012 Interactive Visualization and Data Analysis Group
// Author Victor Matvienko 

var DEFAULT_VERTEX_SHADER = "attribute vec2 pos; void main() { gl_Position = vec4(pos.x,pos.y,0.0,1.0); }"; 

function LenseParam(gl, prog)
{
    this.gl = gl;    
    this.prog = prog;
}
LenseParam.prototype.mouse = function(x, y)
{
    var m = this.prog.Uniform("mouse");
    if (m != null)
        this.gl.uniform2f(m, x, y);
}
LenseParam.prototype.resolution = function(x, y) 
{
    var res = this.prog.Uniform("resolution");    
    if (res != null)
        this.gl.uniform2f(res, x, y);    
}
LenseParam.prototype.offset = function(x, y) 
{
    var res = this.prog.Uniform("offset");    
    if (res != null)
        this.gl.uniform2f(res, x, y);    
}
LenseParam.prototype.scale  = function(rad) 
{
    var v = this.prog.Uniform("scale");    
    if (v != null)
        this.gl.uniform1f(v, rad);       
}
LenseParam.prototype.radius = function(rad) 
{
    var v = this.prog.Uniform("radius");    
    if (v != null)
        this.gl.uniform1f(v, rad);    
}

LenseParam.prototype.black_and_white = function(b) 
{
    var v = this.prog.Uniform("black_and_white");    
    //debugger;
    if (v != null)        
        this.gl.uniform1i(v, b ? 1 : 0);    
}
LenseParam.prototype.background_flip = function(b)
{
    var v = this.prog.Uniform("background_flip");    
    //debugger;
    if (v != null)        
        this.gl.uniform1i(v, b ? 1 : 0);       
}

LenseParam.prototype.mult_composition = function(b)
{
    var v = this.prog.Uniform("mult_composition");    
    //debugger;
    if (v != null)        
        this.gl.uniform1i(v, b ? 1 : 0);       
}

LenseParam.prototype.blending_alpha = function(a)
{
    var v = this.prog.Uniform("blending_alpha");    
    //debugger;
    if (v != null)        
        this.gl.uniform1f(v, a);       
}
LenseParam.prototype.texInput = function(id)
{
    var v = this.prog.Uniform("texInput");    

    //debugger;
    if (v != null)        
        this.gl.uniform1i(v, id - this.gl.TEXTURE0);       
}
LenseParam.prototype.texBluredInput = function(id )
{
    var v = this.prog.Uniform("texBluredInput");    
    //debugger;
    if (v != null)        
        this.gl.uniform1i(v, id- this.gl.TEXTURE0);       
}
 