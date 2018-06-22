"use strict";

export default class Boid {
  constructor(p, x, y, targetX, targetY, skipRate, colFrom, colTo, maxSpeed, traceLength, lineType) {
    this.p = p
    this.targetX = targetX;
    this.targetY = targetY;
    this.skipRate = skipRate;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.acc = p.createVector();

    this.history = [];
    this.traceLength = traceLength;
    this.maxSpeed = 5; // max speed;
    this.maxSteerForce = 0.1; // max steering force

    this.separateDistance = 10;
    this.neighborDistance = 10;
    this.scale = p.random(0.3, 0.98);
    this.colFrom = colFrom
    this.colTo = colTo
    this.sinAdj = p.random(0.1, 1.1);
    this.separateScalar = 1;
    this.cohesionScalar = 1;
    this.alignScalar = 1;
    this.lineType = lineType;
  }
  update() {
    var p = this.p
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed); //***
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();

    var v = this.p.createVector(this.pos.x, this.pos.y)
    this.history.push(v);
    if (this.history.length > this.traceLength){
      this.history.splice(0, 1);
    }

  }
  applyForce(force) {
    this.acc.add(force);
  }
  flock(others) {
    var target = this.p.createVector(this.targetX, this.targetY);
    // var seekForce = this.seek(target);
    var sepaForce = this.separate(others);
    var coheForce = this.cohesion(others);
    var alignForce = this.align(others);

    //adjustment
    // TODO://
    // multiplying forces with some scalers
    // change them over time
    // cohesion and alignforce
    this.separateScalar = 1;
    this.cohesionScalar = 1;
    this.alignScalar = 1;

    sepaForce.mult(this.separateScalar);
    coheForce.mult(this.cohesionScalar);
    alignForce.mult(this.alignScalar);

    //seekForce.mult(1.3);
    sepaForce.div(0.5);
    // this.applyForce(seekForce);
    this.applyForce(sepaForce);
    this.applyForce(coheForce);
    this.applyForce(alignForce);
  }
  seek(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxSteerForce);
    this.applyForce(steer);
    return steer;
  }

  separate(others) {
    var vector = this.p.createVector();
    var count = 0;
    //sum
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);

      if (distance > 0 && distance < this.separateDistance) {
        var diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(distance);
        vector.add(diff); //sum
        count++;
      }
    }

    //avg
    if (count > 0) {
      vector.div(count); //avg
    }
    if (vector.mag() > 0) {
      vector.setMag(this.maxSpeed);
      vector.sub(this.vel); //desired velocity
      vector.limit(this.maxSteerForce);
      this.applyForce(vector);
      return vector;
    }
    return vector;
  }

  cohesion(others) {
    var position = this.p.createVector();
    var count = 0;
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);
      if (distance > 0 && distance < this.neighborDistance) {
        position.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      position.div(count); //avg
      return this.seek(position);
    }
    return position;
  }

  align(others) {
    var velocity = this.p.createVector();
    var count = 0;
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      var distance = this.pos.dist(other.pos);
      if (distance > 0 && distance < this.neighborDistance) {
        velocity.add(other.vel); //sum
        count++;
      }
    }
    if (count > 0) {
      velocity.div(count); //avg
      velocity.setMag(this.maxSpeed);
      var steer = p5.Vector.sub(velocity, this.vel);
      steer.limit(this.maxSteerForce);
      return steer;
    }
    return velocity;
  }

  checkEdges() {
    var p = this.p;
    // x
    if (this.pos.x < 0) {
      this.pos.x = p.width;
    } else if (this.pos.x > p.width) {
      this.pos.x = 0;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = p.height;
    } else if (this.pos.y > p.height) {
      this.pos.y = 0;
    }
  }
  // drawTraces(){
  //   for(var i = 0; i < this.history.length-1; i++){
  //     var pos = this.history[i];
  //     fill(100);
  //     // if (i % 2 == 0) {
  //     //   line(this.history[i].x, this.history[i].y, this.history[i + 1].x, this.history[i + 1].y);
  //     // }
  //
  //     if (i % 50 < 40) {
  //       line(this.history[i].x, this.history[i].y, this.history[i + 1].x, this.history[i + 1].y);
  //     }
  //     // line(this.history[i].x, this.history[i].y, this.history[i + 1].x, this.history[i + 1].y);
  //     // ellipse(pos.x, pos.y, sin(0)*i+1, sin(0)*i+1);
  //
  //   }
  // }


  drawTraces(){
    var p = this.p;

    switch(this.lineType) {
        case "dotted":
          for(var i = 0; i < this.history.length-1; i++){
            var pos = this.history[i];
            var next = this.history[i + 1];
            p.noFill();

            if (i % 4 == 1) {
              p.line(pos.x, pos.y, next.x, next.y);
            }

            // first few add concentric rings
            if( i % 10 > 8 && i > this.history.length/2){
              p.fill(this.colTo)
              p.strokeWeight(2)
              p.ellipse( pos.x, pos.y, 5, 5);
            }
          }

            break;
        case "long":
            for(var i = 0; i < this.history.length-1; i++ ){
              var pos = this.history[i];
              p.fill(0);
              if (i % 5 < 4) {
                  p.line(this.history[i].x, this.history[i].y, this.history[i + 1].x, this.history[i + 1].y);
              }
              // first few add concentric rings
            }
        case "noise":

            for(var i = 0; i < this.history.length-2; i++){
              var pos = this.history[i];
              var next = this.history[i+2];

              // var diff = next.sub(pos);
              var diff = p5.Vector.sub(next, pos);
              diff.normalize();
              diff.rotate(90);
              diff.mult(p.map(p.noise(pos.x / 100, pos.y / 100), 0, 1, -20, 20));
              pos += diff;
              if (i % 15 < 4) {
                p.line(pos.x, pos.y, next.x, next.y);
                // line(next.x+5, next.y+5, last.x, last.y);
              }
              // first few add concentric rings

            }

            break;
        default:

    }
  }

  display() {

    this.p.ellipse(this.pos.x, this.pos.y, 4, 4);
    // push();
    //   translate(this.pos.x, this.pos.y);
    //   rotate(this.angle);
    //   noStroke();
    //   // fill(255, 100);
    //   // if(frameCount % 10 == 1){
    //     fill(color(this.col.from));
    //   // }
    //
    //   scale(this.scale);
    //   ellipse(0, 0, 3, 3);
    //   push();
    //   var freq = frameCount * 0.1 * this.sinAdj;
    //   var amp = 1 * this.sinAdj;
    //   var Adj = sin(freq) * amp;
    //   scale(this.scale * 0.98);
    //   // triangle(0, 0, -7, 5 * Adj, -27, -5 * Adj);
    // pop();
    //
    // pop();
  }

}

function getNormalPoint(pt, a, b) {
  // Vector from a to p
  let ap = p5.Vector.sub(pt, a);
  // Vector from a to b
  let ab = p5.Vector.sub(b, a);
  ab.normalize(); // Normalize the line
  // Project vector "diff" onto line by using the dot product
  ab.mult(ap.dot(ab));
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}
