uniform float uAnimate;
varying vec2 vUv;

void main()
{
    vec3 pos = position;

    float time = uAnimate * 2.;
    float strength = 0.012;

    float xSine = sin(uv.x * 5. + time);
    float ySine = sin(uv.y * 4. + time);

    float zPush = (xSine + ySine) * strength;
    pos.z += zPush;

    float yPush = (xSine) * strength;
    pos.y -= yPush;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}