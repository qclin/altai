import Blob from "./blob";
import smBlob from "./smblob";
import Boid from "./Boid";
import Grid from "./grid";
import { Point, Rectangle, QuadTree } from "./quadtree";

var sketch = function( s ){
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
  var canvasW = window.innerWidth;
  var canvasH = window.innerHeight;
  let boundary
  var isPressed = false;

  s.setup = function(){
    altaiColorFrom = [
      s.color("#D3D3D3"),
      s.color("#A7DFEF"),
      s.color("#F1A7F1"),
      s.color("#FFF"),
      s.color("#A8A0AF"),
      s.color("#DED2BA"),
      s.color("#ECD5A5")
     ]
    altaiColorTo = [
      s.color("#B8C6DB"),  // "Glacier
      s.color("#20BF55"),  // "AlpineMeadow
      s.color("#FAD0C4"), // "Tundra
      s.color("#7AA493"),  // "HighlandFores
      s.color("#9E768F"),  // "SwampForests
      s.color("#A83315"), // "HighlandPrairie
      s.color("#FF9566") // "LowlandPrairie
    ]
    s.createCanvas(canvasW, canvasH)
      .mousePressed(() => {isPressed = true;})
      .mouseReleased(() => {isPressed = false;});
    // above prevents clicks from happening outside of the canvas.

    boundary = new Rectangle(0,0,canvasW, canvasH);
    qtree = new QuadTree(boundary, 4);
    grid = new Grid(canvasW, canvasH);
    grid.setup(s);

    maxdia=canvasH/5;


    setTimeout(setupBlob, 10000);

  }
  /// for each blob you create a quadtree
  function setupBlob(){
    for (var i = 0 ; i < 4; i ++){
      var x = s.random(s.width/2-maxdia,s.width/2+maxdia);
      var y = s.random(s.height/2-maxdia,s.height/2+maxdia);
      var dia=maxdia*s.random(.8, 1.2);

      addBlob(x, y, dia);
    }



  }

  function drawQTree(){
    var p = new Point(s.random(0, s.width), s.random(0, s.height));
    qtree.insert(p);
    console.log(s); // dependancy, recursion problems
    var sketch = s
    qtree.show(sketch);

    s.stroke(0, 255, 0);
    s.rectMode(s.CENTER);
    let range = new Rectangle(s.mouseX, s.mouseY, 25, 25); // this range is probably that green box... unneccessary ?
    s.rect(range.x, range.y, range.w * 2, range.h * 2);
    let points = qtree.query(range);
    // debugger
    for (let p of points) { // here throws weird error if points weren't loaded properly from quadtree
      // strokeWeight(4);
      s.point(p.x, p.y);
    }
  }

  function addBlob(x, y, dia){
    // Choose, assign, splice
    var colorIndex = Math.floor(s.random(altaiColorFrom.length))
    var colFrom = altaiColorFrom[colorIndex];
    var colTo = altaiColorTo[colorIndex];
    // console.log( " COLORS :::",colFrom, colTo )
    // altaiColors.splice(colorIndex, 1);
    altaiColorFrom.splice(colorIndex, 1);
    altaiColorTo.splice(colorIndex, 1);

    var one = new Blob(s, x, y, dia, s.int(dia/2), colFrom, colTo);
    // var one = new Blob(x, y, col.from, col.to, 200);

    zones.push(one);

    var population = s.random(1, 50);
    var maxSpeed = s.random(.1, 1)
    skipRate += 1

    boids.push([]);

    /// BOID TYPE 0
    var lt = lineType[Math.floor(s.random(lineType.length))]

    for (var i = 0; i < population; i++) {
      var posX = s.random(0,s.width);
      var posY = s.random(0,s.height);
      var traceLength = s.random(50, 100);


      boids[boids.length - 1].push(new Boid(s, posX, posY, x, y, skipRate, colFrom, colTo, maxSpeed, traceLength, lt));
    }

    // blue nodes
    setTimeout(function(){
      var repel = new smBlob(s, x, y, 20, 200, col); /// these could appear much later as clickacle into the cosmograms
      repellers.push(repel);
    }, 3000)

  }

  // s.mousePressed(){
  //
  // }
  s.draw = function() {
    s.background(255);
    // grid.display();
    timePassed = s.millis()
    if( timePassed < 8000){
      s.background(0);
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


    if(isPressed){
      for(var i = 0; i < repellers.length; i++){
        repellers[i].clicked();
      }
    }
  }
  function drawEnvironment(){
    for (var i=0; i<zones.length; i++) {
      zones[i].display();
      var oneflock = boids[i];

      // var chooseCos = floor(random(0, cosmos.length))
      // image(cosmos[i], zones[i].x + sin(360) * 8, zones[i].y + sin(360) * 8);
      // var qt = new QuadTree(boundary, 4);
      var qt = new QuadTree(boundary, 4);
      for (var j = 0; j < oneflock.length; j++) {
        qt.insert(oneflock[j].pos)
      }
      zones[i].quadtree = qt;

      drawPopulation(oneflock, i, qt);
      // setTimeout(drawCosmos, 5000);
    }
  }
  function drawPopulation(oneflock, i, qt){
    /// BOID TYPE 0
    var center = createVector(zones[i].x, zones[i].y)

    for (var j = 0; j < oneflock.length; j++) {
      var b = oneflock[j];
      if(minute()%2 == 1){
        var edgePoint = zones[i].path[j + second()]
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
