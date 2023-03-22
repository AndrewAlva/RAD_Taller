uniform float uAnimate;
varying vec2 vUv;

void main()
{
    vec3 pos = position;

    float time = uAnimate * 10.;
    float strength = 0.009;

    float xSine = sin(uv.x * 8. + time);
    float ySine = sin(uv.y * 4. + time);

    float zPush = (xSine + ySine) * strength;
    pos.z += zPush;

    float yPush = zPush * .7;
    pos.y -= yPush;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}