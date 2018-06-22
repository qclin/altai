// var sketch = function( p ){
//   // constructor(w, h){
//     var gridObj = {}
//     gridObj.numberOfRows = 16;
//     gridObj.numberOfColumns = 16;
//
//     gridObj.xStep = p.width/gridObj.numberOfColumns;
//     gridObj.yStep = p.height/gridObj.numberOfRows;
//
//     gridObj.positions = [];
//     gridObj.lines = [];
//     gridObj.w = p.width;
//     gridObj.h = p.height;
//     gridObj.colors = [255, 0];
//     gridObj.strokealpha = [0, 0.2];
//   // }
//
//   gridObj.setup = function (){
//     for(var x = 0; x < gridObj.w; x += gridObj.xStep * Math.floor(p.random(1, 3))){
//       for(var y = 0; y < gridObj.h; y += gridObj.yStep * Math.floor(p.random(1, 3))){
//         var vect = p.createVector(x, y);
//         gridObj.positions.push(vect);
//       }
//     }
//   }
//
//   gridObj.display = function (){
//     p.stroke(0, 1);
//     p.fill(155);
//     for(var i = 0; i < gridObj.positions.length; i ++){
//       p.rect(gridObj.positions[i].x, gridObj.positions[i].y, 8, 8);
//       p.line(gridObj.positions[i].x, gridObj.positions[i].y, gridObj.positions[i].x+10, gridObj.positions[i].y+10);
//     }
//   }
//   return gridObj
// }
//
//
// var Grid = new p5(sketch);
//
export default class Grid{
  constructor(p, w, h){
    this.p = p;
    this.numberOfRows = 16;
    this.numberOfColumns = 16;

    this.xStep = w/this.numberOfColumns;
    this.yStep = h/this.numberOfRows;

    this.positions = [];
    this.lines = [];
    this.w = w;
    this.h = h;
    this.colors = [255, 0];
    this.strokealpha = [0, 0.2];
  }

  setup(){
    var p = this.p
    for(var x = 0; x < this.w; x += this.xStep * Math.floor(p.random(1, 3))){
      for(var y = 0; y < this.h; y += this.yStep * Math.floor(p.random(1, 3))){
        var pos = p.createVector(x, y);
        this.positions.push(pos);
      }
    }
  }

  display(){
    var p = this.p
    p.stroke(0, 1);
    p.fill(155);
    for(var i = 0; i < this.positions.length; i ++){
      p.rect(this.positions[i].x, this.positions[i].y, 8, 8);
      p.line(this.positions[i].x, this.positions[i].y, this.positions[i].x+10, this.positions[i].y+10);
    }
  }
}
