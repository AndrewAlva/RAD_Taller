uniform vec2 uSize;

uniform float uProgress;
uniform float uSignal;

uniform float uAnimate;

varying vec2 vUv;
varying float zPos;

#pragma glslify: rangeF = require('../../shaders/modules/rangeF.glsl')


void main() {
    float ratio = uSize.x / uSize.y;
    vec2 squaredUv = vec2(
        vUv.x,
        vUv.y / ratio
    );

    vec2 squaredCenter = vec2(
        .5,
        .5 / ratio
    );

    //////// Ripples
    // float rippleScale = uSignal * 100.;
    float rippleScale = 20.;

    float circle = distance( squaredUv, squaredCenter );
    float ripples = abs( sin( (circle * rippleScale) + uAnimate) );
    float blackGradient = uSignal * .75 - distance( squaredUv, squaredCenter ) * .5;
    ripples = clamp(ripples - blackGradient, 0., 1.);
    // ripples = smoothstep(0.4, .9, ripples);


    vec3 color = vec3(ripples);
    float alpha = uProgress;

    // Middle
    // float sineProgression = abs(vUv.y -.5) * 2.;
    // sineProgression = 1. - sineProgression;

    float sineProgression = 1. - pow(1. - vUv.y, 1.05);
    // sineProgression *= 1. - vUv.y;
    // sineProgression *= 2.1;

    // color = vec3( 1., 0.4, 0. );
    // color = vec3( sineProgression );
    color = vec3( 0. );

    gl_FragColor = vec4(color, alpha);
}