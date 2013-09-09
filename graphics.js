// Copyright (c) 2012 Interactive Visualization and Data Analysis Group
// Author Victor Matvienko 

 
function TextureUnit(gl, unit_id)
{
    this.gl = gl;
    this.unit_id  = unit_id;
    this.id = gl.createTexture();
}
TextureUnit.prototype.Bind = function()
{
    this.gl.activeTexture(this.unit_id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);    
}
TextureUnit.prototype.LoadFromUrl = function(url)
{
    var tex = this;
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function() { tex.Load(image); }
    image.src = url;     
}
TextureUnit.prototype.Load = function(image)
{
    this.width = image.width;
    this.height = image.height;
    var gl = this.gl
    gl.enable(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (this.onLoaded != null)
        this.onLoaded(this.width, this.height);
}

function Shader(gl, type, src)
{
    this.gl = gl;
    this.id = gl.createShader(type);
    gl.shaderSource(this.id, src);
}
var shader_error = "shader_error"; 

Shader.prototype.Compile = function()
{
    var gl = this.gl;
    gl.compileShader(this.id);
    if (!gl.getShaderParameter(this.id, gl.COMPILE_STATUS))
    {
        var err = gl.getShaderInfoLog(this.id);
        console.log("shader compliation failed: " + err);    
        throw shader_error;            
    }
}
Shader.prototype.AttachTo = function(prog)
{
    this.gl.attachShader(prog.id, this.id);
}
Shader.prototype.Delete = function()
{
    this.gl.deleteShader(this.id);
}


function Program(gl, vs, fs)
{    
    this.gl = gl;
    this.id = gl.createProgram();
    
    if (vs != null)
    {
        vs.AttachTo(this);
    }
    if (fs != null)
    {
        fs.AttachTo(this);     
    }
} 
function ProgramFromCode(gl, vsCode, fsCode)
{
    gl.createProgram();

    var vs = new Shader(gl, gl.VERTEX_SHADER, vsCode);
    var fs = new Shader(gl, gl.FRAGMENT_SHADER, fsCode);

    vs.Compile();
    fs.Compile();    

    var p = new Program(gl, vs, fs);

    vs.Delete();
    fs.Delete(); 
    p.Link();
    return p;
 
} 
Program.prototype.Delete = function()
{
    this.gl.deleteProgram(this.id);    
}
Program.prototype.Link = function()
{
    var gl = this.gl;
    gl.linkProgram(this.id);
    if( !gl.getProgramParameter(this.id, gl.LINK_STATUS) )
    {
        var infoLog = gl.getProgramInfoLog(this.id);
        gl.deleteProgram( this.id);
        console.log( "linker error: " + infoLog);
        throw shader_error;
    }    
}
// this function requires the program to be in use
Program.prototype.Uniform = function(name)
{
    return this.gl.getUniformLocation(this.id, name);
}
Program.prototype.Attribute = function(name)
{
    return this.gl.getAttribLocation(this.id, name);
}
Program.prototype.Use = function()
{
    this.gl.useProgram(this.id);
}
