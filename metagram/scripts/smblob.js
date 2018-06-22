//bubbles Pierre MARZIN 09/2017
// reference https://www.openprocessing.org/sketch/445834

export default class smBlob {

  constructor(p, x, y, dia, n, col){
    this.p=p;
    this.x=x;
    this.y=y;
    this.offset1=1
    this.offset2=10
    this.vx=p.random(-1, 1);
    this.vy=p.random(-1, 1);

    // this.vx=sin(this.angle);
    // this.vy=sin(this.angle);
    this.dia=dia;
    this.n=n;
    this.points=[];
    this.Y_AXIS = 1;
    this.X_AXIS = 2;
    this.fillColor = p.color(0, 0, 255, 155);
    this.angle=p.TWO_PI/n;
    for (var i=0; i<n; i++) {
      this.points[i]=p.createVector(this.dia * p.sin(i*this.angle), this.dia * p.cos(i*this.angle));
    }
    this.paused = false;
  }

  clicked(){
    var p = this.p
    console.log("sm -- clicked");
    var d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
    console.log(d, this.dia);

    p.ellipse(this.x, this.y, 10, 10);
    if(d < 100){
      this.fillColor = p.color(255, 0, 0);
      p.noLoop();
      this.paused = true /// TODO : pause logic
    }else{
      if(this.paused){
        p.loop();
      }
    }
    // no need to check for proximity, should release if clicked
    /// here can transition into another scene
  }

  display () {
    var px, py;
    this.x+=this.vx*0.001;
    this.y+=this.vy*0.01;
    var collide=false;
    var noisescale = .001; //.001
    var noisefactor = 2;
    beginShape();
    var i;
    for (var j=0; j<=this.n*2; j++) {
      fill(this.fillColor);

      i=j%this.n;
      px=this.x+this.points[i].x+this.dia*noisefactor*(1-2*noise(noisescale*(this.points[i].x+this.x+this.offset1), noisescale*(this.points[i].y+this.y+this.offset1)));
      py=this.y+this.points[i].y+this.dia*noisefactor*(1-2*noise(noisescale*(this.points[i].x+this.x+this.offset2), noisescale*(this.points[i].y+this.y+this.offset2)));
      vertex(px, py);
      if (!collide&&(px+this.vx<0||px+this.vx>width)){
        this.vx=-this.vx;
        collide=true;
      }
      if (py+this.vy<0||py+this.vy>height){
        this.vy=-this.vy;
        collide=true;
      }
    }
    endShape();
  }

}
