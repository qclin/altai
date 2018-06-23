export default class Gradient{
  constructor(p, palette, quantity){
    this.p = p;
    this.Y_AXIS = 1;
    this.X_AXIS = 2;
    // this.b1 = p.color(255);
    // this.b2 = palette[2];
    // palette[p.floor(p.random(palette.length))]
    this.c1 = p.color(255)
    this.c2 = palette[p.floor(p.random(palette.length))]
    this.w = 60
    this.h = 10
    this.x = p.random(p.width)
    this.y = p.random(p.height)
    this.quantity = quantity
    this.r = p.floor(p.random(4));
    this.distance = 1.2;
  }

  setup() {
    // noLoop();

  }

display() {
    var p = this.p; 
    // Background
    // this.setGradient(0, 0, p.width/2, p.height, this.b1, this.b2, this.X_AXIS);
    // this.setGradient(p.width/2, 0, p.width/2, p.height, this.b2, this.b1, this.X_AXIS);
    // Foreground
    // print(this.c1, this.c2)
    for(var i = 1; i < this.quantity; i ++){

      var boxWidth, boxHeight, posX, posY, axis;
      switch (this.quantity) {
        case 6: // align left float down
          boxWidth = this.w;
          boxHeight = this.h;
          posX = this.x - boxWidth
          posY = this.y + boxHeight*i
          axis = this.Y_AXIS

          if(this.x < 0){
            this.x = p.width
          }else{
            this.x -= 0.01
          }
          break
        case 2:  // align right float down
          boxWidth = this.w*2;
          boxHeight = this.h*2;
          posX = this.x + boxWidth/i*2
          posY = this.y - boxHeight/i*2
          axis = this.Y_AXIS
          if(this.y < 0){
            this.y = p.height
          }else{
            this.y -=0.01
          }
          break
        case 4:  // align left float up
          boxWidth = i*this.w;
          boxHeight = i*this.h;
          posX = this.x - boxWidth;
          if(this.distance > 4){
            this.distance = 1
          }else{
            this.distance += 0.001
          }

          posY = this.y - boxHeight*i/this.distance;
          axis = this.X_AXIS
          if(this.x > p.width){
            this.x = 0
          }else{
            this.x +=0.05
          }
          break
        // case 3:  // align left float up
        //   boxWidth = this.w *2;
        //   boxHeight = this.h*2;
        //   posX = this.x + boxWidth/i
        //   posY = this.y - boxHeight*i/1.2
        //   break
      }
      this.setGradient(posX, posY, boxWidth, boxHeight, this.c1, this.c2, axis);
    }
  }
  // this.setGradient(50, 150, 140, 40, this.c2, this.c1, this.X_AXIS);

setGradient(x, y, w, h, c1, c2, axis) {
  var p = this.p;
  p.noFill();
  if (axis == this.Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = p.map(i, y, y+h, 0, 1);
      var c = p.lerpColor(p.color(c1), p.color(c2), inter);
      p.stroke(c);
      p.line(x, i, x+w, i);
    }
  }
  else if (axis == this.X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = p.map(i, x, x+w, 0, 1);
      var c = p.lerpColor(p.color(c1), p.color(c2), inter);
      p.stroke(c);
      p.line(i, y, i, y+h);
    }
  }
}

}
