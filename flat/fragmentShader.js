var fragmentShader = `
precision highp float;

varying float v_t;

const float PI = 3.14159265359;

vec3 cubehelix(float x, float y, float z) {
  float a = y * z * (1.0 - z);
  float c = cos(x + PI / 2.0);
  float s = sin(x + PI / 2.0);
  return vec3(
    z + a * (1.78277 * s - 0.14861 * c),
    z - a * (0.29227 * c + 0.90649 * s),
    z + a * (1.97294 * c)
  );
}

vec3 rainbow(float t) {
  if (t < 0.0 || t > 1.0) t -= floor(t);
  float ts = abs(t - 0.5);
  return cubehelix(
    (360.0 * t - 100.0) / 180.0 * PI,
    1.5 - 1.5 * ts,
    0.8 - 0.9 * ts
  );
}

void main() {
  gl_FragColor = vec4(rainbow(v_t / 4.0 + 0.25), 1.0);
}
`
module.exports = {
  fragmentShader
}
