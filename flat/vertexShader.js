var vertexShader = `
  precision highp float;

  const float PI = 3.14159265359;

  uniform float u_a;
  uniform float u_b;
  uniform float u_c;
  uniform float u_d;

  attribute vec2 a_position;

  varying float v_t;

  void main() {
    float x1, x2 = a_position.x;
    float y1, y2 = a_position.y;
    for (int i = 0; i < 8; i++) {
      x1 = x2, y1 = y2;
      x2 = sin(u_a * y1) - cos(u_b * x1);
      y2 = sin(u_c * x1) - cos(u_d * y1);
    }
    v_t = atan(a_position.y, a_position.x) / PI;
    gl_Position = vec4(x2 / 2.0, y2 / 2.0, 0.0, 1.0);
    gl_PointSize = 1.5;
  }
`
module.exports = {
  vertexShader
}
