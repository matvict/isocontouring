// Copyright (c) 2012 Interactive Visualization and Data Analysis Group
// Author Victor Matvienko 

function TFDemo(canvas_element)
{
    this.canvas = canvas_element;
    try
    {
        this.gl = canvas_element.getContext("experimental-webgl", {alpha: false});
    }
    catch (e)
    {           
        alert(
            "WebGL Initialization Error",
            "Sorry, your browser doesn't support WebGL, try Google Chrome");    
        return;
    }
    var me = this;
    this.canvas.onmouseout = function(ev)
    {
        me.pan = false;
        me.mouse_x = -100000;
        me.mouse_y = -100000;
    }
    this.canvas.onmousedown = function(ev)
    {        
        me.pan = true;
        me.mouse_down_x = ev.clientX;
        me.mouse_down_y = ev.clientY;
    }
    this.canvas.onmouseup = function(ev)
    {
        me.pan = false;
    }

    this.canvas.onmousemove = function(ev)
    {        
        me.mouse_x = ev.clientX;
        me.mouse_y = ev.clientY;              
    }
    this.resx = canvas_element.width;
    this.resy = canvas_element.height;
    this.mouse_x = -100000;
    this.mouse_y = -100000;
    this.offset = {x:0, y:0};
 
    this.quad = new QuadGeometry(this.gl);
    this.loadDefaultShader();
}

TFDemo.prototype.setImage = function(url)
{
    this.NewTexture(url);
}

TFDemo.prototype.startRendering = function()
{    
    function renderLoop2(me)
    {
        me.Paint();
        setTimeout(renderLoop2, 0, me);
    }
    setTimeout(renderLoop2, 0, this );
}
TFDemo.prototype.listCompositionModes = function()
{
    return ["multiply", "average" ];
}
 
TFDemo.prototype.setImage = function(name)
{

    this.loadTextures("im/" + name, "im/blur/"+name);   
}

TFDemo.prototype.loadDefaultShader = function()
{    
    var gl = this.gl;    
    var src = requestText("lense.glsl");
    var prog =  ProgramFromCode(gl, DEFAULT_VERTEX_SHADER, src);

    if( this.program != null )
        this.program.Delete();

    this.program = prog;
    this.shader_param = new LenseParam(gl, prog);

    return "Shader compiled successfully";
}

function resetCanvas(me)
{
    me.numTexLoaded += 1;
    if (me.numTexLoaded == 2)
    {
        me.started = true;
        me.canvas.hidden = false;
    }
}

TFDemo.prototype.loadTextures = function(tex, blur)
{
    var gl = this.gl;

    if (this.texInput == null)
        this.texInput = new TextureUnit(gl, gl.TEXTURE0);   
    if (this.texBluredInput == null)
        this.texBluredInput = new TextureUnit(gl, gl.TEXTURE1);

    me = this;
    this.started = false;
    this.numTexLoaded = 0;
    this.texInput.onLoaded = function (w, h) 
    {
     //   debugger;
        me.resx = w;
        me.resy = h;
        me.canvas.width = w;
        me.canvas.height  =h;   
        resetCanvas(me);    
    }
    this.texBluredInput.onLoaded = function() { resetCanvas(me); };
    this.texBluredInput.LoadFromUrl(blur);
    this.texInput.LoadFromUrl(tex);
}

TFDemo.prototype.Paint = function()
{
    if (!this.started)
         return;

    var gl = this.gl;
    gl.viewport( 0, 0, this.resx, this.resy);
  
    this.program.Use();
    this.quad.SetPositionAttribute(this.program.Attribute("pos") );    
    this.shader_param.mult_composition(this.mult_composition);
    this.shader_param.blending_alpha(this.blending_alpha);
    this.shader_param.black_and_white( this.black_and_white);
    this.shader_param.background_flip(this.background_flip);
    this.shader_param.radius(this.lense_size);
    
    var rect = this.canvas.getBoundingClientRect();
    var bottom = rect.top;

    this.shader_param.mouse(
        this.mouse_x - rect.left, 
        rect.bottom - this.mouse_y);

    this.shader_param.resolution(this.resx, this.resy);
    this.shader_param.texInput(this.texInput.unit_id);
    this.shader_param.scale(this.scale);

    if (this.pan)
    {
        this.offset.x -= this.mouse_x - this.mouse_down_x;
        this.offset.y -= this.mouse_y - this.mouse_down_y;
        if (this.offset.x < 0)
            this.offset.x = 0;
        if (this.offset.y < 0)
            this.offset.y = 0;         

        this.mouse_down_x = this.mouse_x;
        this.mouse_down_y = this.mouse_y;
    }

    this.offset_max = {
        x: this.resx *(this.scale - 1), 
        y: this.resy *(this.scale - 1) };

    if (this.offset.x > this.offset_max.x)
        this.offset.x = this.offset_max.x;
    if (this.offset.y > this.offset_max.y)
        this.offset.y = this.offset_max.y;

    this.shader_param.offset(this.offset.x / this.resx, this.offset.y/this.resy);     
    this.texInput.Bind()  
    this.shader_param.texBluredInput(this.texBluredInput.unit_id);              
    this.texBluredInput.Bind();   
    this.quad.Draw(); 
    this.gl.flush();
}
