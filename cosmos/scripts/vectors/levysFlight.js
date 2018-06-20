
export default  class LevysFlight{

  constructor(x, y){
    this.startX = x;
    this.startY = y;
    this.leaped = false;
    this.points = []
  }

  setup(){
    this.pos = createVector(this.startX, this.startY);
    this.prev = this.pos.copy();
    // console.log(this.pos);
    // this.points.push(this.pos)
  }

  display(){
    stroke(255,0,0);
    strokeWeight(1);
    //point(pos.x, pos.y);
    if(this.points.length > 1000){
      this.points.splice(0,1);
    }
    for(var i =1; i < this.points.length; i ++){
      line(this.points[i-1].x, this.points[i-1].y, this.points[i].x, this.points[i].y);
    }
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
    this.prev.set(this.pos);

    var step = p5.Vector.random2D();

    var r = random(100);
    if (r < 1) {
      this.leaped = true;

      step.mult(random(35, 100));

    } else {
      this.leaped = false;

      step.setMag(5);
    }
    //this.pos = this.pos + step;
    this.pos.add(step);

    var refPoint = this.pos.copy();
    this.points.push(refPoint)

  }

};
