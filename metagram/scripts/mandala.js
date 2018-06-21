
export default class Mandala{
	constructor(palette){
		this.c1 = color(255, 0, 100, 200);
		this.c2 = color(100, 100, 255, 200);
		this.countSteps = 200;
	}
	setup() {
		background(100);
	}
	display(){
		push();
	    translate(width / 2, height / 2);
	    for (var i = 0; i <= this.countSteps; i++) {
	      var r = map(i, 0, this.countSteps, 200, 0);
	      var c = lerpColor(this.c1, this.c2, map(i, 0, this.countSteps, 0, 1));
	      stroke(c);
	      strokeWeight(4);
	      var countSegments = 100;
	      beginShape();
	        for (var j = 0; j < countSegments; j++) {
	          var x = r * cos(map(j, 0, countSegments, 0, 2 * PI));
	          var y = r * sin(map(j, 0, countSegments, 0, 2 * PI));
	          // vertex(x + r * noise(x / 100, y / 100, 0), y + r * noise(x / 100, y / 100, 100));
	  				vertex(x * noise(x) *r, y * noise(y)* r);

	        }
	      endShape(CLOSE);
	    }
		pop();
	}
}
