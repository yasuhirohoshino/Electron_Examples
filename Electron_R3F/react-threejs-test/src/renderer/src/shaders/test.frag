precision highp float;

#include utils.glsl;

#define PI 3.1415926535

varying vec2 vUv;

uniform float time;

void main() {
  float c = min(snoise(vec3(vUv * 25.0, time * 10.0)) + sin(mod(distance(vUv, vec2(0.5)) - time, 1.0) * 10.0 * PI * 2.0) * 0.5 + 0.5, 1.0);
  gl_FragColor = vec4(vec3(c), 1.0);
}