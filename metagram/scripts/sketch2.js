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

}


// var cosmo5 = new p5(sketch, 'cosmoSketch');

export default function cosmo5(){
  $("<div class='canvasContainer'> <div class='blurLayer'></div> <span id='closeModal' onclick='backToMeta();'> x </span> <div id='cosmoSketch'> </div> </div> ").appendTo('body');
  modalOpened = true;
  return new p5(sketch, 'cosmoSketch');
}
