import Blob from "./blob";
import smBlob from "./smblob";
import Boid from "./Boid";
import Grid from "./grid";
import { Point, Rectangle, QuadTree } from "./quadtree";

import './sketch2'
/*
instantiate
grid
blob
smBlob
*/

var sketch = function(p){



  let qtree;
  var zones = [], repellers = [], boids = [], flock, boidsHistory = []
  // Environment zones
  var maxdia;
  var skipRate = 1;
  var lineType = ["dotted", "long" , "noise"]
  var cosmos = [];
  var showCosmo = false;
  var altaiColorFrom, altaiColorTo;
  var col, grid, milli, timePassed
  // function preload(){
  //   for(var i = 0; i < 4; i++){
  //     cosmos.push(loadImage(`assets/cosmoSVG/cosmo_${i+1}.svg`));
  //   }
  // }
  var canvas;
  var canvasW = window.innerWidth;
  var canvasH = window.innerHeight;
  let boundary
  var isPressed = false;

  p.setup = function(){
    altaiColorFrom = [
      p.color("#D3D3D3"),
      p.color("#A7DFEF"),
      p.color("#F1A7F1"),
      p.color("#FFF"),
      p.color("#A8A0AF"),
      p.color("#DED2BA"),
      p.color("#ECD5A5")
     ]
    altaiColorTo = [
      p.color("#B8C6DB"),  // "Glacier
      p.color("#20BF55"),  // "AlpineMeadow
      p.color("#FAD0C4"), // "Tundra
      p.color("#7AA493"),  // "HighlandFores
      p.color("#9E768F"),  // "SwampForests
      p.color("#A83315"), // "HighlandPrairie
      p.color("#FF9566") // "LowlandPrairie
    ]
    canvas = p.createCanvas(canvasW, canvasH)
    canvas.mousePressed(cPressed)
      // .mouseReleased(() => {isPressed = false;});
    // above prevents clicks from happening outside of the canvas.

    boundary = new Rectangle(0,0,canvasW, canvasH);
    qtree = new QuadTree(p,boundary, 4);
    grid = new Grid(p, canvasW, canvasH);
    grid.setup();

    maxdia=canvasH/5;


    setTimeout(setupBlob, 10000);

  }
  function cPressed(){
    console.log("metagram, canvas pressed ")
    for(var i = 0; i < repellers.length; i++){
      repellers[i].clicked();
    }
  }
  /// for each blob you create a quadtree
  function setupBlob(){
    for (var i = 0 ; i < 4; i ++){
      var x = p.random(p.width/2-maxdia,p.width/2+maxdia);
      var y = p.random(p.height/2-maxdia,p.height/2+maxdia);
      var dia=maxdia*p.random(.8, 1.2);

      addBlob(x, y, dia);
    }



  }

  function drawQTree(){
    var pt = new Point(p.random(0, p.width), p.random(0, p.height));
    qtree.insert(pt);
    qtree.show();

    p.stroke(0, 255, 0);
    p.rectMode(p.CENTER);
    let range = new Rectangle(p.mouseX, p.mouseY, 25, 25); // this range is probably that green box... unneccessary ?
    p.rect(range.x, range.y, range.w * 2, range.h * 2);
    let points = qtree.query(range);
    // debugger
    for (let pt of points) { // here throws weird error if points weren't loaded properly from quadtree
      // strokeWeight(4);
      p.point(pt.x, pt.y);
    }
  }

  function addBlob(x, y, dia){
    // Choose, assign, splice
    var colorIndex = Math.floor(p.random(altaiColorFrom.length))
    var colFrom = altaiColorFrom[colorIndex];
    var colTo = altaiColorTo[colorIndex];
    // console.log( " COLORS :::",colFrom, colTo )
    // altaiColors.splice(colorIndex, 1);
    altaiColorFrom.splice(colorIndex, 1);
    altaiColorTo.splice(colorIndex, 1);

    var one = new Blob(p, x, y, dia, p.int(dia/2), colFrom, colTo);
    zones.push(one);

    var population = p.random(1, 50);
    var maxSpeed = p.random(.1, 1)
    skipRate += 1

    boids.push([]);

    /// BOID TYPE 0
    var lt = lineType[Math.floor(p.random(lineType.length))]

    for (var i = 0; i < population; i++) {
      var posX = p.random(0,p.width);
      var posY = p.random(0,p.height);
      var traceLength = p.random(50, 100);


      boids[boids.length - 1].push(new Boid(p, posX, posY, x, y, skipRate, colFrom, colTo, maxSpeed, traceLength, lt));
    }

    // blue nodes
    setTimeout(function(){
      var repel = new smBlob(p, x, y, 20, 200, col); /// these could appear much later as clickacle into the cosmograms
      repellers.push(repel);
    }, 3000)

  }
  p.mousePressed = function(){
    // console.log("pressed metagram")

  }
  p.draw = function() {
    p.background(255);
    // grid.display();
    timePassed = p.millis()
    if( timePassed < 8000){
      p.background(0);
      drawQTree();
    }
    if( 5000 < timePassed && timePassed < 100000){
      grid.display();
    }
    if(timePassed > 5000){
      drawEnvironment();
    }
    for (var i=0; i<repellers.length; i++) {
      repellers[i].display();
    }



  }
  function drawEnvironment(){
    for (var i=0; i<zones.length; i++) {
      zones[i].display();
      var oneflock = boids[i];

      // var chooseCos = floor(random(0, cosmos.length))
      // image(cosmos[i], zones[i].x + sin(360) * 8, zones[i].y + sin(360) * 8);

      // var qt = new QuadTree(boundary, 4);
      // for (var j = 0; j < oneflock.length; j++) {
      //   qt.insert(oneflock[j].pos)
      // }
      // zones[i].quadtree = qt;

      drawPopulation(oneflock, i);
      // setTimeout(drawCosmos, 5000);
    }
  }
  function drawPopulation(oneflock, i){
    /// BOID TYPE 0
    var center = p.createVector(zones[i].x, zones[i].y)

    for (var j = 0; j < oneflock.length; j++) {
      var b = oneflock[j];
      if(p.minute()%2 == 1){
        var edgePoint = zones[i].path[j + p.second()]
        b.seek(edgePoint);
      }else{
        b.seek(center);
        // b.seek(zones[i].path[]);
      }

      b.separateScalar += 0.1 * i
      b.flock(oneflock);
      b.update();
      b.checkEdges();
      b.display();
      b.drawTraces();

      // boidsHistory[i].push(boids[i].pos);
    }
  }
}

var metap5 = new p5(sketch, 'p5sketch');


/// click blob, metagram creates a new html element, attach div
