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

var canvas, agent, agentMask, agent2, agent2Mask;
var envFig, imgMode, palette = [], chooseIndex, vector, gradients = [];

var loading = true;
var constant = 250;
var angle = 0.05;
var scalar = 400;
var speed = 0.005;
var step = 0;

var t, agentX, agentY;

var agent_type = [ "common", "elemental", "isolation", "recognition", "social", "couple", "influencer", "predator", "sensor", "trans"]
var agent_family = ["animal", "humanoid", "min", "spirit", "electronic", "mechanic", "plant"]

// TODO: refactor to network request for image
var env_type = ["apline_meadow", "highland_forest", "lowland_prairie", "tundra", "glacier", "highland_prairie", "swamp_forest"]
var env_mode = ["land", "por"]

function loadAgent(){
  var chooseAgentType = agent_type[Math.floor(Math.random(agent_type.length) * agent_type.length)]
  var chooseAgentFamily = agent_family[Math.floor(Math.random(agent_family.length) *agent_family.length)]
  var agentPath = `./assets/agents/${chooseAgentType}/${chooseAgentFamily}.png`
  var agentTexturePath = `./assets/agents/family_texture/${chooseAgentFamily}/00.png` // range of 0-5 minimum
  return {agentPath, agentTexturePath}
}

$(document).ready(function(){
  $.ajax({
    url: "http://18.207.83.80/textures", // TODO: REPLACE with agent type request
    success: function(data) {
      agent = loadImage(data.agent.replace('assets/','')); /// remove hack
      agentMask = loadImage(data.family.replace('assets/','')); /// remove hack
      agent2 = loadImage(data.agent1.replace('assets/','')); /// remove hack
      agent2Mask = loadImage(data.family1.replace('assets/','')); /// remove hack
      var temp = data.environment.split('/')
      imgMode = temp[temp.length - 2]
      envFig = loadImage(data.environment.replace('assets/','')); /// remove hack
      loading = false;
      window.setup();
    }
  });
});

window.setup = function(){
  // here we extract some colors from environment
  canvas = createCanvas(window.innerHeight, window.innerHeight);
  print((window.innerWidth - window.innerHeight)/2)
  canvas.position((window.innerWidth - window.innerHeight)/2 , 0);
  if(loading) return
  // (imgMode == 'land') ? image(envFig, 0, 280) : image(envFig, 0, 0)
    print(envFig, imgMode)
  if(imgMode == 'land'){
    image(envFig, 0, 280);
  }else{
    image(envFig, 0, 0);
  }

  for(var i=0; i<10; i++){
    var x = floor(random(0, envFig.width))
    var y = (imgMode == 'land') ? floor(random(280 , envFig.height)) : floor(random(0 , envFig.height))
    var color = get(x, y);
    palette.push(color);
  }

  agent.mask(agentMask);
  agent2.mask(agent2Mask);
  // canvas = createCanvas( 0.618 * window.innerHeight, window.innerHeight); // create a protrait frame with golden ratio

  // choose vector & setup conditions
  // vector = new Diffuser(width, height);
  // vector = new Conway(width, height);
  // vector = new gLife(width, height, palette);
  // vector = new LevysFlight(width/2, height/2); // should be agent starting point

  // var rorsShapeSize = 480 *  Math.min(width, height) / 640; // update units to width, height
  // vector = new RorschachShape({
  //       shapeSize: rorsShapeSize,
  //       vertexCount: Math.floor(1.5 * rorsShapeSize),
  //       noiseDistanceScale: random(0.005, 0.04),
  //       noiseMagnitudeFactor: random(1, 4),
  //       noiseTimeScale: 0.0005,
  // }, palette);


  ////// ----------- if penrose
  // vector = new PenroseLSystem();
  // vector.simulate(5);

  vector = new deJong()
  vector.setup();

  setInterval(addDialog, 2000);

  chooseIndex = Math.floor(Math.random(palette.length) * palette.length)

  agentX = 0
  agentY = 0
  t=0;

}

function addDialog(){
  // var dialogAmt = floor(random(1, 7));
  //
  // for(var i = 0; i < dialogAmt; i++){
    if(gradients.length > 5){
      gradients.splice(0, 1);
    }
    var dialogRange = [2, 4, 6]
    var quantity = dialogRange[floor(random(dialogRange.length))];
    var gradient = new Gradient(palette, quantity);
    gradient.setup();
    gradients.push(gradient)
  // }
}


window.draw = function(){
  if(loading) return
  /// if dejong ? don't draw background & envFig
  // Step 1 Environment
  // background(palette[chooseIndex]);
  // background(255);
  if(frameCount < 10){ /// HACK, to draw in only the first 10 frame
    if(imgMode == 'land'){
      image(envFig, 0, 280);
    }else{
      image(envFig, 0, 0);
    }
  }
  // Step 2.0 Grid

  drawGrid();
  // Step 2 Imprint
  // vector.display();

  // // for levy's flight
  // if(vector.leaped){
  //   background(255, 0, 0);
  // }

  // Step 2.1 Dialogs
  for(var i =0; i < gradients.length; i ++){
    gradients[i].display();
  }

  // Step 3 Agent
  push();
  translate(width/2, height/2);
    var pposx = sin(angle) * scalar //* noise(t);
    var pposy = cos(angle) * scalar //* noise(t);
    image(agent2, pposx, pposy ,agent2.width/6, agent2.height/6);
    angle = angle + speed;
  pop();

  ////-----------------  if rorschach

    // agentX = (width/2 - agent.width/12) - step


  push()
  var noiseX = map(noise(t), 0,1, -100, 100);
  // agentX = (width/2 - agent.width/12) - step
  agentX = width/2 + noiseX
  step = (step > height - width/4) ? 0 : step
  agentY = width/4 + step
  step += 1
  image(agent, agentX, agentY ,agent.width/6, agent.height/6);

  pop();


  // image(agent,width/2, height/2)
  //////----------------- if levy

  // for(var i = 0; i < vector.points.length; i ++){
  //   if(i< 1){
  //     image(agent, vector.points[vector.points.length-i].x, vector.points[vector.points.length-i].y, agent.width/9, agent.height/9);
  //   }
  // }
  // image(agent, vector.pos.x, vector.pos.y, agent.width/9, agent.height/9);


    /// consider two agents playing catch up
    ///// currentValue = currentValue * 0.9 + targetValue * 0.1.
    //////----------------- levy

  t = t + 0.01;

  if (frameCount % 600 == 0) {
  	// background(255);
  }
}

function drawGrid(){
  push();
  translate(width/2, height/2);
  // mainline
  for (var i = 0; i < 8; i++) {
    push();
    rotate(TWO_PI * i / 8);
    for(var j =0; j < height/4; j+= 30){
      stroke(0)
      line(j, j, j+10, j+10);
      line(j+20, j+20, j+25, j+25);
    }
    pop();
  }
  // subline
  for (var i = 0; i < 6; i++) {
    push();
    rotate(TWO_PI * i / 6);

    // line(0, 0, height/3,height/3);
    for(var j =0; j < height/3; j+= 50){
      stroke(0)
      line(j, j, j+30, j+30);
      line(j+40, j+40, j+45, j+45);
    }
    pop();
  }
    // rings
    stroke(255, 255, 255, 155)
    polygon(0, 0, 400, 30);
    rotate(frameCount / 120.0);
    polygon(0, 0, 300, 10);
    polygon(0, 0, 100, 3);
  pop()
}


function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  noFill();
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
