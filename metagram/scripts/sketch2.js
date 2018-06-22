import $ from 'jquery'

var sketch = function(p){
  var color = 0;
  var canvas;

  p.setup = function(){
    canvas = p.createCanvas(window.innerHeight, window.innerHeight)
    canvas.position((window.innerWidth - window.innerHeight)/ 2, 0);
    canvas.mousePressed(cPressed);
  }
  function cPressed(){
    console.info("sketch cosmos ")
    color = (color + 16) % 256;
  }
  p.draw = function(){
    p.background(color);
  }

  p.mousePressed = function(){

  }
}


// var cosmo5 = new p5(sketch, 'cosmoSketch');

export default function cosmo5(){
  $("<div id='cosmoSketch'> </div> ").appendTo('body');

  return new p5(sketch, 'cosmoSketch');
}
