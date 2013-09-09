"use strict";

 
var  cont = null;

function init() 
{
  cont = new TFController(); 
  return !cont.failed;
}

function TFController()
{
   this.lense_size_slider = $("#lense_size_slider");
   this.black_and_white  = $("#black_and_white");
   this.background_flip  = $("#background_flip");
   this.mult_composition = $("#mult_composition");
   this.blend_composition = $("#blend_composition");
   this.zoom_slider = $("#zoom");
   ///this.blending_alpha  = $("#blending_alpha");
   this.alpha_slider = $("#alpha_slider");


   var cnv = $("#viewport")[0];
  // cnv.hidden = true;
   
   var ctx  = getContext(cnv);
   if (!ctx)
   {
      alert(    
        "This page requires WebGL support in your browser. Try using Google Chrome.");
      this.failed  = true;
      return;
   }

   this.app  = new TFDemo(cnv, ctx);    
   //this.check_gl();
   this.init_imagelist();
   this.setup();
  
}
function getContext(cvs)
{
   
  var contextNames = ['experimental-webgl','moz-webgl','webkit-3d', 'webgl'];
  ///var contextNames = ['experimental-webgl'];
  var ctx;

  if(navigator.userAgent.indexOf('MSIE') >= 0) 
  {
    try {
      ctx = WebGLHelper.CreateGLContext(cvs, 'canvas');
    }
    catch(e){}
  }
  else
  {
    for(var i = 0; i < contextNames.length; i++){
      try{
        ctx = cvs.getContext(contextNames[i], {alpha:false});
        if(ctx)
          break;            
      }catch(e){}
    }
  } 
  return ctx;
}
 


function setImage(url, id) { cont.setImage(url, id); }
TFController.prototype.init_imagelist = function() 
{
  var moreimages = //" n1.png n2.png n3.png n4.png n5.png n6.png n7.png grad.png";
  "";
  var images = 
    ("apple.png dino.png elephant.png flower.png mona.png swan.png tomatoes.png" + 
    moreimages).split(" ");
  
  var template = [];  
  var len = images.length;
  for (var i=0; i<len; i++)
  {
    var im =  images[i];
    //console.log(im);
    var id = "im"+i.toString();
    template.push(
      ['li', { 'id':id}, 
          ['a', {
            'class':'thumb', 'name':'leaf',
             'href':"javascript:setImage('" +im + "','" +id +"');"},
        //['a', {'class':'thumb', 'name':'leaf', 'href':"im/" + im },
          ['img', {'src' : "im/thumb/" + im} ]
        ]
      ]);     
  }
  var g  = $(".thumbs")[0];
  g.appendChild(microjungle(template));

  $("li").hover(function(){
    $(this).fadeOut(300);
    $(this).fadeIn(10);});

}
 
TFController.prototype.setup = function()
{
 
  var app = this.app;
 
   //$(function() { blending_alpha.slider(); });

   //$("#viewport_height").change(function() {app.resize(); } );
   //$("#viewport_width").change (function() {app.resize(); } );

    
   this.black_and_white.change (function()  { app.black_and_white  = ischecked($(this));    });
   this.background_flip.change (function()  { app.background_flip  = ischecked($(this));   });
   //this.blending_alpha.change (function()   { app.blending_alpha   = parseFloat($(this).val());  });
   
   var me = this;
   this.blend_composition.change(function() {
    var ch =  ischecked($(this));
    check(me.mult_composition, !ch);    
    app.mult_composition = !ch;   

    enable_slider(me.alpha_slider, ch);   
   });
   this.mult_composition.change(function() {     
    var ch =  ischecked($(this));
    check(me.blend_composition, !ch);      
    enable_slider(me.alpha_slider, !ch);   
    app.mult_composition = ch;   
  });



   app.lense_size = 40;
   //this.lense_size.val(app.lense_size);
    
   

   check(this.background_flip , false);
   app.background_flip = false;



   check(this.black_and_white, true);
   app.black_and_white = true;
  // app.Paint();
  // cnv.hidden = true;

   check(this.mult_composition, false);
   app.mult_composition = false;

   check(this.blend_composition, true);
  // this.blending_alpha.val(0.5);
   app.blending_alpha = 0.5;
   app.scale = 1.0;

   var me = this;
   $(function() {me.alpha_slider.slider(
    {
      min:0,
      max: 1,
      step: 0.1,
      value:app.blending_alpha,
      slide: function(event, ui) 
      {
         app.blending_alpha = ui.value;
        // me.blending_alpha.val(ui.value);
      }
    }); 
   });


   $(function() {me.lense_size_slider.slider(
    {
      min:1,
      max: 300,
      step: 1,
      value:app.lense_size,
      slide: function(event, ui) 
      {
         app.lense_size = ui.value;
        // me.blending_alpha.val(ui.value);
      }
    }); 
   });


   $(function() {me.zoom_slider.slider(
    {
      min:1,
      max: 4,
      step: 0.5,
      value:app.scale,
      slide: function(event, ui) 
      {
         app.scale = ui.value;
        // me.blending_alpha.val(ui.value);
      }
    }); 
   });
   this.setImage("apple.png", "im0");
   setRequestAnimFrame();
   app.startRendering();
 }

var old_selected;
TFController.prototype.setImage = function(url, ifd) {
  if (old_selected != null)     
    $("#" + old_selected).removeClass("selected");
  $("#" + ifd).addClass("selected");
  old_selected = ifd;
  
  
  this.app.setImage(url);
 };
