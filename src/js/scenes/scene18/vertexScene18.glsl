uniform float uSignal;
uniform float uAnimate;

varying vec2 vUv;
varying float zPos;

void main()
{
    vec3 pos = position;
    zPos = pos.z;
    pos.y += pos.z;
    pos.z = 0.;

    float sineProgression = 1. - pow(1. - uv.y, 3.);
    sineProgression *= 1. - uv.y;
    sineProgression *= 4.;
    // pos.x -= sineProgression * .5;

    // float sine = sin((uv.y * (uSignal * 20.)) + (uAnimate) );
    float sine = sin((uv.y * (.5 * 20.)) + (uAnimate) );
    sine *= (1. - uv.y);
    sine *= .5;
    // sine -= (1. - uv.y) * .5;
    pos.x += sine * sineProgression;
    // pos.x -= (1. - uv.y) * .5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}