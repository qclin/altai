export default class Diffuser{
  constructor(width, height){
    this.grid = [];
    this.next = [];

    this.dA = 1;
    this.dB = 0.5;
    this.feed = 0.055;
    this.k = 0.062;

    this.width = 200
    this.height = 200
  }
  setup(){
    pixelDensity(1);
    print(this.width, this.height)
    for (var x = 0; x < this.width; x++) {
      this.grid[x] = [];
      this.next[x] = [];
      for (var y = 0; y < this.height; y++) {
        this.grid[x][y] = {
          a: 1,
          b: 0
        };
        this.next[x][y] = {
          a: 1,
          b: 0
        };
      };
    }

    for (var i = 100; i < 110; i++) {
      for (var j = 100; j < 110; j++) {
        this.grid[i][j].b = 1;
      }
    }
  }
  display(){
    for (var x = 1; x < this.width - 1; x++) {
      for (var y = 1; y < this.height - 1; y++) {
        var a = this.grid[x][y].a;
        var b = this.grid[x][y].b;
        this.next[x][y].a = a +
          (this.dA * this.laplaceA(x, y)) -
          (a * b * b) +
          (this.feed * (1 - a));
        this.next[x][y].b = b +
          (this.dB * this.laplaceB(x, y)) +
          (a * b * b) -
          ((this.k + this.feed) * b);

        this.next[x][y].a = constrain(this.next[x][y].a, 0, 1);
        this.next[x][y].b = constrain(this.next[x][y].b, 0, 1);
      }
    }


    loadPixels();
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var pix = (x + y * this.width) * 4;
        var a = this.next[x][y].a;
        var b = this.next[x][y].b;
        var c = floor((a - b) * 255);
        c = constrain(c, 0, 255);
        pixels[pix + 0] = c;
        pixels[pix + 1] = c;
        pixels[pix + 2] = c;
        pixels[pix + 3] = 255;
      }
    }
    updatePixels();


    this.swap();
  }

  laplaceA(x, y) {
    var sumA = 0;
    sumA += this.grid[x][y].a * -1;
    sumA += this.grid[x - 1][y].a * 0.2;
    sumA += this.grid[x + 1][y].a * 0.2;
    sumA += this.grid[x][y + 1].a * 0.2;
    sumA += this.grid[x][y - 1].a * 0.2;
    sumA += this.grid[x - 1][y - 1].a * 0.05;
    sumA += this.grid[x + 1][y - 1].a * 0.05;
    sumA += this.grid[x + 1][y + 1].a * 0.05;
    sumA += this.grid[x - 1][y + 1].a * 0.05;
    return sumA;
  }

  laplaceB(x, y) {
    var sumB = 0;
    sumB += this.grid[x][y].b * -1;
    sumB += this.grid[x - 1][y].b * 0.2;
    sumB += this.grid[x + 1][y].b * 0.2;
    sumB += this.grid[x][y + 1].b * 0.2;
    sumB += this.grid[x][y - 1].b * 0.2;
    sumB += this.grid[x - 1][y - 1].b * 0.05;
    sumB += this.grid[x + 1][y - 1].b * 0.05;
    sumB += this.grid[x + 1][y + 1].b * 0.05;
    sumB += this.grid[x - 1][y + 1].b * 0.05;
    return sumB;
  }



  swap() {
    var temp = this.grid;
    this.grid = this.next;
    this.next = temp;
  }

}
