import $ from 'jquery';
import "./utility"
import Diffuser from "./vectors/reactionDiffusion" // not working atm
import Conway from "./vectors/conway"
import gLife from "./vectors/gameofLife"
import LevysFlight from "./vectors/levysFlight"
import RorschachShape from "./vectors/rorschach"
import PenroseLSystem from "./vectors/penrose"
import deJong from "./vectors/dejong"
import Gradient from "./gradient"


/* TODO:
  -[] switch conditions for vectors
  -[] depending on vector, determine drawBackground refreshrate
  -[] update canvas to window size, thus update image load ratio
  -[] consider serving assets from S3 and remove hacks
  -[] *** agent material mask not working
*/

var sketch = function(p){


  var canvas, agent, agentMask, agent2, agent2Mask;
  var envFig, imgMode, palette = [], chooseIndex, vector, gradients = [];

  var loading = true;
  var constant = 250;
  var angle = 0.05;
  var scalar = 400;
  var speed = 0.005;
  var step = 0;
  var t, agentX, agentY;

  var env_mode = ["land", "por"]
  $(document).ready(function(){
    $.ajax({
      url: "http://localhost:3000/textures", // TODO: REPLACE with agent type request
      success: function(data) {
        agent = p.loadImage(data.agent); /// remove hack
        agentMask = p.loadImage(data.family); /// remove hack
        agent2 = p.loadImage(data.agent1); /// remove hack
        agent2Mask = p.loadImage(data.family1); /// remove hack
        var temp = data.environment.split('/')
        imgMode = temp[temp.length - 2]
        envFig = p.loadImage(data.environment); /// remove hack
        loading = false;
        p.setup();
      }
    });
  });

  p.setup = function(){
    // here we extract some colors from environment
    canvas = p.createCanvas(window.innerHeight, window.innerHeight);
    canvas.position((window.innerWidth - window.innerHeight)/2 , 0);
    canvas.mousePressed(cPressed);

    p.background(255);
    if(loading) return
    // (imgMode == 'land') ? p.image(envFig, 0, 280) : p.image(envFig, 0, 0)
      // print(envFig, imgMode)
    if(imgMode == 'land'){
      // x, y, width, height,
      var scaledHeight = (p.width/16) * 9
      var yStart = (p.height-scaledHeight)/2
      p.image(envFig, 0, yStart, p.width, scaledHeight);
    }else{
      var scaledWidth = (p.width/16) * 9
      p.image(envFig, 0, 0, scaledWidth, p.height);
    }

    for(var i=0; i<10; i++){
      var x = p.floor(p.random(0, envFig.width))
      var y = (imgMode == 'land') ? p.floor(p.random(280 , envFig.height)) : p.floor(p.random(0 , envFig.height))
      var color = p.get(x, y);
      palette.push(color);
    }

    agent.mask(agentMask);
    agent2.mask(agent2Mask);

    // choose vector & setup conditions
    // vector = new Diffuser( p, width, height); // works but slow

    // TODO: test which one works
    // vector = new Conway( p, width, height);
    // vector = new gLife( p, width, height, palette);


    // vector = new LevysFlight( p, width/2, height/2); // should be agent starting point
    // var rorsShapeSize = 480 *  Math.min(width, height) / 640; // update units to width, height
    // vector = new RorschachShape(p, {
    //       shapeSize: rorsShapeSize,
    //       vertexCount: Math.floor(1.5 * rorsShapeSize),
    //       noiseDistanceScale: p.random(0.005, 0.04),
    //       noiseMagnitudeFactor: p.random(1, 4),
    //       noiseTimeScale: 0.0005,
    // }, palette );


    ////// ----------- if penrose
    // vector = new PenroseLSystem(p);
    // vector.simulate(5);

    vector = new deJong(p)
    vector.setup();

    setInterval(addDialog, 2000);

    chooseIndex = Math.floor(p.random(palette.length))

    agentX = 0
    agentY = 0
    t=0;

  }

  function cPressed(){
    console.info("pressed on sketch cosmos  ")
  }

  function addDialog(){
    // var dialogAmt = floor(p.random(1, 7));
    //
    // for(var i = 0; i < dialogAmt; i++){
      if(gradients.length > 5){
        gradients.splice(0, 1);
      }
      var dialogRange = [2, 4, 6]
      var quantity = dialogRange[p.floor(p.random(dialogRange.length))];
      var gradient = new Gradient(p, palette, quantity);
      gradient.setup();
      gradients.push(gradient)
    // }
  }


  p.draw = function(){
    if(loading) return
    /// if dejong ? don't draw background & envFig
    // Step 1 Environment
    // p.background(palette[chooseIndex]);
    // p.background(255);
    if(p.frameCount < 10){ /// HACK, to draw in only the first 10 frame
      if(imgMode == 'land'){
        var scaledHeight = (p.width/16) * 9
        var yStart = (p.height-scaledHeight)/2
        p.image(envFig, 0, yStart, p.width, scaledHeight);
      }else{
        var scaledWidth = (p.width/16) * 9
        p.image(envFig, 0, 0, scaledWidth, p.height);
      }
    }
    // Step 2.0 Grid

    drawGrid();
    // Step 2 Imprint
    // vector.display();

    // // for levy's flight
    // if(vector.leaped){
    //   p.background(255, 0, 0);
    // }

    // Step 2.1 Dialogs
    for(var i =0; i < gradients.length; i ++){
      gradients[i].display();
    }

    // Step 3 Agent
    p.push();
    p.translate(p.width/2, p.height/2);
      var pposx = p.sin(angle) * scalar //* noise(t);
      var pposy = p.cos(angle) * scalar //* noise(t);
      p.image(agent2, pposx, pposy ,agent2.width/6, agent2.height/6);
      angle = angle + speed;
    p.pop();

    ////-----------------  if rorschach

      // agentX = (width/2 - agent.width/12) - step


    p.push()
    var noiseX = p.map(p.noise(t), 0,1, -100, 100);
    // agentX = (p.width/2 - agent.width/12) - step
    agentX = p.width/2 + noiseX
    step = (step > p.height - p.width/4) ? 0 : step
    agentY = p.width/4 + step
    step += 1
    p.image(agent, agentX, agentY ,agent.width/6, agent.height/6);

    p.pop();


    // p.image(agent,p.width/2, p.height/2)
    //////----------------- if levy

    // for(var i = 0; i < vector.points.length; i ++){
    //   if(i< 1){
    //     p.image(agent, vector.points[vector.points.length-i].x, vector.points[vector.points.length-i].y, agent.width/9, agent.height/9);
    //   }
    // }
    // p.image(agent, vector.pos.x, vector.pos.y, agent.width/9, agent.height/9);


      /// consider two agents playing catch up
      ///// currentValue = currentValue * 0.9 + targetValue * 0.1.
      //////----------------- levy

    t = t + 0.01;

    if (p.frameCount % 600 == 0) {
    	// p.background(255);
    }
  }

  function drawGrid(){
    p.push();
    p.translate(p.width/2, p.height/2);
    // mainline
    for (var i = 0; i < 8; i++) {
      p.push();
      p.rotate(p.TWO_PI * i / 8);
      for(var j =0; j < p.height/4; j+= 30){
        p.stroke(0)
        p.line(j, j, j+10, j+10);
        p.line(j+20, j+20, j+25, j+25);
      }
      p.pop();
    }
    // subline
    for (var i = 0; i < 6; i++) {
      p.push();
      p.rotate(p.TWO_PI * i / 6);

      // line(0, 0, height/3,height/3);
      for(var j =0; j < p.height/3; j+= 50){
        p.stroke(0)
        p.line(j, j, j+30, j+30);
        p.line(j+40, j+40, j+45, j+45);
      }
      p.pop();
    }
      // rings
      p.stroke(255, 255, 255, 155)
      polygon(0, 0, 400, 30);
      p.rotate(p.frameCount / 120.0);
      polygon(0, 0, 300, 10);
      polygon(0, 0, 100, 3);
    p.pop()
  }


  function polygon(x, y, radius, npoints) {
    var angle = p.TWO_PI / npoints;
    p.noFill();
    p.beginShape();
    for (var a = 0; a < p.TWO_PI; a += angle) {
      var sx = x + p.cos(a) * radius;
      var sy = y + p.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }
}

export default function cosmo5(){
  $("<div class='canvasContainer'> <div class='blurLayer'></div> <div id='cosmoSketch'> </div> <span id='closeModal' onclick='backToMeta();'> </span> </div> ").appendTo('body');
  modalOpened = true;
  return new p5(sketch, 'cosmoSketch');
}
