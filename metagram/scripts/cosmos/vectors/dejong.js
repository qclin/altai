export default class deJong{

  constructor(p){
    this.p = p
    this.a = -2.78,
    this.b = -2.79,
    this.c = -0.85,
    this.d = 2.79,
    this.range =[-3, 3],
    this.x = 0,
    this.y = 0,
    this.x2, this.y2,
    this.iteration = 0
  }

  setup(){
    var p = this.p
    var RED = p.color(251, 53, 80, 100);
    p.stroke(RED);
    p.strokeWeight(0.5);
  }

  randomParams() {
    var p = this.p
      this.a = p.random(-3.0, 3.0);
      this.b = p.random(-3.0, 3.0);
      this.c = p.random(-3.0, 3.0);
      this.d = p.random(-3.0, 3.0);
  }
  init() {
    this.iteration = 0;
    this.x = 0;
    this.y = 0;
  }

  display() {
    var p = p;
      for (var i = 0; i < 1000; i++) {
          this.x2 = p.sin(this.a * this.y) - p.cos(this.b * this.x);
          this.y2 = p.sin(this.c * this.x) - p.cos(this.d * this.y);
          this.x = this.x2;
          this.y = this.y2;
          p.point(p.map(this.x2, -2, 2, 50, p.width - 50), p.map(this.y2, -2, 2, 50, p.height - 50));
      }

      this.iteration++;
      if (this.iteration >= 1000) {
          this.randomParams();
          this.init();
      }
  }


}
