uniform float uSignal;
uniform float uAnimate;
uniform float uStrength;

varying vec2 vUv;
varying float zPos;

void main()
{
    vec3 pos = position;
    zPos = pos.z;
    pos.y += pos.z;
    pos.z = 0.;

    float rAnimate = uAnimate - sin(uAnimate * .131 + sin(uAnimate * .5));

    float period = 20.;
    float height = .4;
    float heightSine = sin(uAnimate * .2) * .5 + .5;
    heightSine *= height;
    heightSine += 0.8;
    height = heightSine;
    float fractUv = sin((uv.y + (uAnimate + 33.) * .207) * 3.) * .5 + .5;
    fractUv *= 0.7;
    fractUv += 0.53;
    height *= fractUv;

    float sineProgression = 1. - pow(1. - uv.y, 1.);
    sineProgression *= 1. - uv.y;
    sineProgression *= 3.;
    sineProgression *= height;
    // pos.x -= sineProgression * .5;

    float sine = sin((uv.y * (uSignal * period)) + (uAnimate) );
    sine *= pow(1. - uv.y, 0.7);
    sine *= (1. - uv.y);
    sine *= .5;
    sine *= 2.5;
    // sine -= (1. - uv.y) * (.5 + (sineProgression * .835));
    // pos.x += height;
    // float verticalOffset = sine * sineProgression;
    float verticalOffset = sine;
    verticalOffset *= uStrength;
    pos.x += verticalOffset;
    // pos.x -= (1. - uv.y) * .5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}