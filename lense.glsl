// Copyright (c) 2012 Interactive Visualization and Data Analysis Group
// Author Victor Matvienko 

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

//uniform float time;
uniform vec2 resolution;
uniform vec2 offset;
uniform vec2 mouse;
uniform sampler2D texInput;
uniform sampler2D texBluredInput;
uniform float radius;

uniform int black_and_white;
uniform int background_flip;
uniform float blending_alpha;
uniform int mult_composition;

uniform float scale;


//uniform sampler2D tex1;


float QueryLod(vec2 pos) { return 1.0; }
vec3  sampleTexture(vec2 pos)
{
  return texture2D(texInput, (pos + offset)/scale).xyz;  
}

float SampleVolume(vec2 pos) 
{
  vec3 col = texture2D(texBluredInput, (pos + offset)/scale).xyz;
  return (col.x + col.y + col.z) / 3.0;   
}


vec2 ComputeGradient(vec2 vCenter, vec2 StepSize) 
{
  float fVolumValXp = SampleVolume(vCenter+vec2(+StepSize.x,0));
  float fVolumValXm = SampleVolume(vCenter+vec2(-StepSize.x,0));
  float fVolumValYp = SampleVolume(vCenter+vec2(0,-StepSize.y));
  float fVolumValYm = SampleVolume(vCenter+vec2(0,+StepSize.y));  
  return vec2(fVolumValXm - fVolumValXp,
              fVolumValYp - fVolumValYm) / 2.0;
}

vec2 Gradient(vec2 pos)
{
   return ComputeGradient(pos, vec2(1,1) / resolution) ;
}
 

#define  pi 3.14159265358979323846264
// number of the harmonics in the transfer function
#define n_harmonics 4
// lowest considered value for the gradient magnitude 
#define epsilon  1e-7
// the ratio of the harmonic amplitudes of consequetive scales
#define amplitude_ratio 0.95
// log2 of the nyquist frequency
#define  log_nyquist_frequency -1

 
 
vec4 MagicTransferFunction(in vec2 pos)
{

    vec2 gradient = Gradient(pos);
    float gradient_magnitude = length(gradient);
    if (gradient_magnitude < epsilon)
        return vec4(1, 1, 1, 1);
    
    float lod =  QueryLod(pos);
    int   log_base_frequency = int(floor(log2(gradient_magnitude) + lod));
    float base_frequency =  pow(2.0, float(log_nyquist_frequency - log_base_frequency));
    
    float value = SampleVolume(pos);
    float arg =  2.0 * pi * value * base_frequency;

    float amplitude = 1.0;
    float scale = 1.0;
    float sum_amplitude = 0.0;
    float result = 0.0;
    for (int i=0; i < n_harmonics; i++)
    {
        result += amplitude * ( cos(arg * scale) * 0.5 + 0.5);
        scale /= 2.0;
        sum_amplitude += amplitude;
        amplitude *= amplitude_ratio;
    }
    result /= sum_amplitude;
    return vec4(result, result, result, 1.0);
}

// vec4 MagicTransferFunction(in vec2 pos)
// {
//   const int n = 4;
//   vec4 res = vec4(0.0, 0.0, 0.0, 0.0);
//   vec2 oldpos = pos;
//   for (int i =0; i < n; i++)
//   {
//     vec2 gradient = Gradient(pos);
//     vec2 or;
    
//     or.x = gradient.y;
//     or.y = -gradient.x;  

//     or = or / length(or) *5.0 ;       
//     res = res + ComputeMagicTransferFunction(pos);    
//     pos = pos + or;    
//   } 
//   pos = oldpos;
//   for (int i =0; i < n; i++)
//   {
//     vec2 gradient = Gradient(pos);
//     vec2 or;
//     or.x = gradient.y;
//     or.y = -gradient.x;   
//     or = or / length(or) *5.0;  
//     res = res + ComputeMagicTransferFunction(pos);    
//     pos = pos - or;    
//   } 
//   return res / (2.0*float(n));
// }

void main(void)
{
  vec2 pp =  gl_FragCoord.xy;
  vec2 sp =  gl_FragCoord.xy;
  sp.y =  float(resolution.y) - sp.y;
  vec2 p = sp.xy / resolution.xy;
  
  vec2 m =  mouse.xy / resolution.xy;
  vec2 dm = mouse.xy - pp.xy;
  vec3 color  = sampleTexture(p);
  if (black_and_white > 0)
  {
    float col = (color.x +color.y + color.z ) / 3.0;
    color = vec3(1.0, 1.0, 1.0) *col;
  }
  
  float rlen = length(dm);
  bool inside_circle = rlen < radius; 
//  bool draw_tf = inside_circle && background_flip == 0;  
   
  if (!inside_circle && background_flip == 0)
  {
     gl_FragColor = vec4(color, 1);
  }
  else 
  { 
    // compute function with some compositing
    vec4 tf = MagicTransferFunction(p);       
    if (mult_composition > 0) { tf.xyz = tf.xyz * color.xyz; }
    else { tf.xyz = tf.xyz *blending_alpha + (1.0 - blending_alpha) *color; }
    tf.w = 1.0;
    
    if (inside_circle)
    // make smooth edges 
    {
      float lambda  =  rlen*rlen*rlen*rlen  / (radius*radius * radius*radius);      
      if (background_flip > 0)
        lambda = 1.0 - lambda;
      tf.xyz = tf.xyz *(1.0 - lambda) + lambda  * color;
    }
    
    gl_FragColor = tf;
  }
   
  
  
  
}