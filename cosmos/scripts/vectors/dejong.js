export default class deJong{

  constructor(){
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
    var RED = color(251, 53, 80, 100);
    stroke(RED);
    strokeWeight(0.5);
  }

  randomParams() {
      this.a = random(-3.0, 3.0);
      this.b = random(-3.0, 3.0);
      this.c = random(-3.0, 3.0);
      this.d = random(-3.0, 3.0);
  }
  init() {
    this.iteration = 0;
    this.x = 0;
    this.y = 0;
  }

  display() {
      for (var i = 0; i < 1000; i++) {
          this.x2 = sin(this.a * this.y) - cos(this.b * this.x);
          this.y2 = sin(this.c * this.x) - cos(this.d * this.y);
          this.x = this.x2;
          this.y = this.y2;
          point(map(this.x2, -2, 2, 50, width - 50), map(this.y2, -2, 2, 50, height - 50));
      }

      this.iteration++;
      if (this.iteration >= 1000) {
          this.randomParams();
          this.init();
      }
  }


}
