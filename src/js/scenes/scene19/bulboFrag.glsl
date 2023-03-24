uniform vec2 uSize;

uniform float uProgress;
uniform float uSignal;
uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform vec3 uColor1;

uniform float uAnimate;

varying vec2 vUv;

#pragma glslify: rangeF = require('../../shaders/modules/rangeF.glsl')


void main() {
    // Rotation


    // Globals
    float ratio = uSize.x / uSize.y;
    vec2 squaredUv = vec2(
        vUv.x,
        // vUv.y / ratio
        min(vUv.y / ratio, 1.)
    );

    vec2 squaredCenter = vec2(
        .5,
        .5 / ratio
    );

    vec3 color;
    float speed1 = uAnimate * 10.;
    float rAnimate = speed1 - sin(speed1 * 1.131 + sin(speed1 * .5));


    //////// Ripples
    float rippleScale = uSignal * 100.;

    float circle = distance( squaredUv, squaredCenter );
    float ripples = abs( sin( (circle * rippleScale) + uAnimate) );
    float blackGradient = uSignal * .75 - distance( squaredUv, squaredCenter ) * .5;
    ripples = clamp(ripples - blackGradient, 0., 1.);


    //////// Textures
    // vec4 mask = texture2D(tMap1, vUv).rrrr;
    vec4 mask = texture2D(tMap1, vUv);
    vec4 uvTexture = texture2D(tMap2, vUv);
    float smoothMask = smoothstep(0.7, 1., mask.a);
    if (smoothMask <= 0.) discard;


    //////// Waving
        // Sine variation
        float fractUv = sin((vUv.y + (speed1 + 33.) * .207) * 3.) * .5 + .5;
        fractUv *= 1.7;
        // fractUv += 0.53;
        float sineProgression = 1. - pow(1. - vUv.y, 30.05);
        sineProgression *= fractUv;

    float steps = 6.;
    float factor = 1. / steps;
    float wave = sin(vUv.x * 5. + speed1) * .5 + .5;
    float waveStrength = wave * 0.25;
    waveStrength *= sineProgression;
    // wave = 1. - smoothstep(squaredCenter.y - 0.01, squaredCenter.y, vUv.y + waveStrength);
    wave = (vUv.y + waveStrength);
    float steppedWave = floor(wave / factor) * 0.1;
    wave = steppedWave;


    //////// Testing
    vec3 strokeColor = vec3(ripples);
    // vec3 strokeColor = vec3(1., 0., 0.);
    strokeColor *= mask.r;

    // vec3 fillColor = uColor1;
    // vec3 fillColor = uvTexture.rgb;
    // vec3 fillColor = vec3(squaredUv.y);
    vec3 fillColor = vec3(wave);
    fillColor *= mask.b;
    // fillColor *= uColor1;
    color = strokeColor + fillColor;

    float alpha = uProgress;
    gl_FragColor = vec4(color, alpha * mask.a);
}