uniform float uAnimate;
varying vec2 vUv;

void main()
{
    vec3 pos = position;

    float time = uAnimate * 10.;
    float strength = 0.016;

    float xSine = sin(uv.x * 11. + time);
    float ySine = sin(uv.y * 5. + time);

    float zPush = (xSine + ySine) * strength;
    pos.z += zPush;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}