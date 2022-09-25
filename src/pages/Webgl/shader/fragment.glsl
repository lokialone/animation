uniform float time;
uniform sampler2D uImage;
uniform vec2 hover;
varying vec2 vUv;
varying float vNoise;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    // gl_FragColor = texture2D(uImage, vUv);
    gl_FragColor = vec4(vNoise, 0., 0., 1.0);
}