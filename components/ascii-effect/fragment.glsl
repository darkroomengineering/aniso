uniform sampler2D uCharactersTexture;
uniform float uGranularity;
uniform float uCharactersLimit;
uniform bool uFillPixels;
uniform vec3 uColor;
uniform bool uOverwriteColor;
uniform bool uGreyscale;
uniform bool uInvert;
uniform bool uMatrix;
uniform float uTime;

float grayscale(vec3 c) {
    return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
}

float random(in float x) {
  return fract(sin(x)*1e4);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 size = vec2(16.);

    // pixelate the input texture
    vec2 division = resolution / uGranularity;
    vec2 d = 1. / division;
    vec2 pixelizedUV = d * (floor(uv / d) + 0.5);

    if(uMatrix) {
        float noise = random(pixelizedUV.x);
        pixelizedUV = mod(pixelizedUV + vec2(0., uTime * abs(noise) ),1.);
    }

    vec4 pixelizedColor = texture2D(inputBuffer, pixelizedUV);
    float grayColor = grayscale(pixelizedColor.rgb);

    if(uInvert) {
        grayColor = 1. - grayColor;
    }

    // get the character index
    float charIndex = floor(grayColor * (uCharactersLimit -  1.));
    float charX = mod(charIndex, size.x);
    float charY = floor(charIndex / size.y);

    // fit with the grid
    vec2 charUV = mod(uv * (division/size), 1./size);

    // start to top/left
    charUV -= vec2(0.,1./size);

    // offset to the character
    vec2 offset = vec2(charX, -charY) / size;
    charUV += offset;

    vec4 ascii = texture2D(uCharactersTexture, charUV);

    if(uOverwriteColor) {
        ascii.rgb *= uColor;
        ascii.a *= pixelizedColor.a;
    } else {
        ascii *= pixelizedColor;
    }

    outputColor = ascii;

    if(uFillPixels) {
        outputColor = pixelizedColor + vec4(ascii.r);
    }

    if(uGreyscale) {
        outputColor.rgb = vec3(grayscale(outputColor.rgb));
    }
    
}