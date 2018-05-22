import d3 from '../public/d3-sketch/d3.min.js';




var ratio = window.devicePixelRatio || 1,
    width = 960 * ratio,
    height = 480 * ratio,
    n = 1000,
    vertices;

var voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);

var canvas = d3.select("#chart").append("canvas")
    .attr("width", width)
    .attr("height", height)
    // .style("width", width / ratio + "px")
    // .style("height", height / ratio + "px")
    .style("width", "100%")
    .style("height", "100%")
    .on("click", function() {
      var mouse = d3.mouse(this);
      // reset(mouse[0] * ratio, mouse[1] * ratio);
      reset(width/2, height/2);
    });

var context = canvas.node().getContext("2d");
context.fillStyle = 'rgba(255, 255, 255, 0.1)';
context.lineWidth = 0.5 * ratio;
context.strokeStyle = "rgba(255, 255, 255, 0.1)";

var iterations,
    format = d3.format(",f"),
    fill = d3.scale.linear().domain([0, Math.sqrt(width * height / n) * 4]);

setInterval(function(){
  redraw();
},100)
//d3.timer(redraw, 5000);

reset(width / 2, height / 2);

function redraw() {
  var cells = voronoi(vertices),
      dx = 0,
      dy = 0,
      edges = {};

  for (var i = 0, n = cells.length; i < n; ++i) {
    var cell = cells[i];
    if (cell == null) continue;

    var area = d3.geom.polygon(cell).area(),
        centroid = cell.centroid(-1 / (6 * area)),
        vertex = vertices[i],
        δx = centroid[0] - vertex[0],
        δy = centroid[1] - vertex[1];
    dx += Math.abs(δx);
    dy += Math.abs(δy);
    vertex[0] += δx, vertex[1] += δy;

    var p0 = cell[0];
    if (!p0) continue;
    context.fillStyle = 'rgba(0, 255, 255, 0)'; // fill(Math.sqrt(area));
    context.beginPath();
    context.moveTo(p0[0], p0[1]);
    for (var j = 1, m = cell.length, k0 = p0[0] + "," + p0[1]; j < m; ++j) {
      var p = cell[j];
      context.lineTo(p[0], p[1]);
      var k = p[0] + "," + p[1];
      if (k0 < k) edges[k0 + "," + k] = [p0, p];
      else edges[k + "," + k0] = [p, p0];
      p0 = p, k0 = k;
    }
    context.fill();
  }
  for (var k in edges) {
    var e = edges[k], e0 = e[0], e1 = e[1];
    context.beginPath();
    context.moveTo(e0[0], e0[1]);
    context.lineTo(e1[0], e1[1]);
    context.stroke();
  }

  d3.select("#iterations").text(format(++iterations));

  if (dx * dx + dy * dy < 1e-6) return true;
}

function reset(x, y) {
  var hcl = d3.hcl(Date.now() % 360, 27, 83);
  fill.range([hcl, hcl.darker(2)]);
  vertices = d3.range(n).map(function(d) {
    return [x + Math.random() - .5, y + Math.random() - .5];
  });
  iterations = 0;
}
