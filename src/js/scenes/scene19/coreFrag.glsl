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
    float rippleScale = uSignal * 100.;

    float circle = distance( squaredUv, squaredCenter );
    float ripples = abs( sin( (circle * rippleScale) + uAnimate) );
    float blackGradient = uSignal * .75 - distance( squaredUv, squaredCenter ) * .5;
    ripples = clamp(ripples - blackGradient, 0., 1.);


    vec3 color = vec3(ripples);
    // vec3 color = vec3(1., 0., 0.);
    float alpha = uProgress;

    // vec4 tex1 = texture2D(tMap1, vUv).rrrr;
    vec4 tex1 = texture2D(tMap1, vUv);
    vec4 tex2 = texture2D(tMap2, squaredUv);
    float smoothMask = smoothstep(0.7, 1., tex1.a);
    if (smoothMask <= 0.) discard;

    color *= tex1.r;

    vec3 fillColor = uColor1 * tex1.b;
    // vec3 fillColor = tex2.rgb * tex1.b;
    color += fillColor;

    gl_FragColor = vec4(color, alpha * tex1.a);
}