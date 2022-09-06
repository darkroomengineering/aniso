uniform float uCharLength;
uniform float uCharSize;
uniform sampler2D uFont;
uniform bool uOverwriteColor;
uniform vec3 uColor;
uniform bool uInvert;
uniform bool uPixels;
uniform bool uGreyscale;
uniform bool uOverwriteTime;
uniform bool uMatrix;
uniform float uTime;

float grayscale(vec3 c) {
  return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
}

float random(in float x) {
  return fract(sin(x)*1e4);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 cSize = vec2(16.,16.);
  float cLength = cSize.x * cSize.y;
  
  // vec2 division = vec2(256.,128);
  vec2 division = resolution / uCharSize;
  vec2 d = 1. / division;
  
  vec2 pixelizationUv = d * (floor(uv / d) + 0.5);

  if(uMatrix) {
    float noise = random(pixelizationUv.x);
    pixelizationUv = mod(pixelizationUv + vec2(0., (uOverwriteTime ? uTime : (time * 0.1)) * abs(noise) ),1.);
  }

  vec4 color = texture2D(inputBuffer, pixelizationUv);



  float gray = grayscale(color.rgb);

  if(uInvert) {
    gray = 1. - gray;
  }
    
  float cIndex = floor( gray * uCharLength);
  float cIndexX = mod(cIndex, cSize.x);
  float cIndexY = floor(cIndex / cSize.y);
  
  vec2 offset = vec2(cIndexX, cIndexY) / cSize;
  float ascii = texture2D( uFont, mod(uv * (division/cSize), 1./cSize) - vec2(0.,1./cSize.y) - offset).r;

  if(color.a == 0.) {
    ascii = 0.;
  }

  
  if(uPixels) {
    if(ascii > 0.) {
      color.rgb = vec3(1.);
    }
  } else {
    color *= ascii;
  }

  if(uOverwriteColor && color.a > 0.) {
    color.rgb = uColor;
  }

  outputColor = color;

  if(uGreyscale) {
    outputColor = vec4(vec3(gray), color.a);
  }
}