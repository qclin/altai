//bubbles Pierre MARZIN 09/2017
// reference https://www.openprocessing.org/sketch/445834
export default class Blob {

  constructor(p, x, y, dia, n, colFrom, colTo ){
    this.x=x;
    this.y=y;
    this.offset1=p.random(10);
    this.offset2=p.random(10);
    this.vx=p.random(-1, 1);
    this.vy=p.random(-1, 1);

    // this.vx=sin(this.angle);
    // this.vy=sin(this.angle);
    this.dia=dia;
    this.n=n;
    this.points=[];
    this.Y_AXIS = 1;
    this.X_AXIS = 2;
    this.huFrom = colFrom
    this.huTo = colTo

    this.angle=p.TWO_PI/n;
    for (var i=0; i<n; i++) {
      this.points[i]=p.createVector(this.dia * p.sin(i*this.angle), this.dia * p.cos(i*this.angle));
    }

    this.path = [];
    this.quadtree;
  }


  display () {
    var p = this.p; 
    var posX, posY;
    this.x+=this.vx*0.1;
    this.y+=this.vy*0.1;
    var collide=false;
    var noisescale = .001; //.001
    var noisefactor = 2;
    p.beginShape();
    var i;

    for (var j=0; j<=this.n*3; j++) {

      var gradColor = p.lerpColor(this.huFrom, this.huTo, p.cos(j));
      var gradColor2 = p.lerpColor(this.huFrom, this.huTo, p.sin(j));
      // fill(color(this.huFrom.levels[0], this.huFrom.levels[1], this.huFrom.levels[2], 155));
      // stroke(color(gradColor2.levels[0], gradColor2.levels[1], gradColor2.levels[2], 155));
      p.fill(this.huFrom);
      p.stroke(this.huTo);
      i=j%this.n;
      posX=this.x+this.points[i].x+this.dia*noisefactor*(1-2*p.noise(noisescale*(this.points[i].x+this.x+this.offset1), noisescale*(this.points[i].y+this.y+this.offset1)));
      posY=this.y+this.points[i].y+this.dia*noisefactor*(1-2*p.noise(noisescale*(this.points[i].x+this.x+this.offset2), noisescale*(this.points[i].y+this.y+this.offset2)));

      p.vertex(posX, posY);
      /// here create an array to store the points of the blob edges
      let point = p.createVector(posX, posY);
      this.path.push(point);

      if (!collide&&(posX+this.vx<0||posX+this.vx > width)){
        this.vx=-this.vx;
        collide=true;
      }
      if (posY+this.vy<0||posY+this.vy > height){
        this.vy=-this.vy;
        collide=true;
      }
    }
    p.endShape();

  }

}
