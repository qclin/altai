var BLUE, RED;
var x, y, x2, y2, a, b, c, d, iteration;
var controlKit;
var params = {
    a: -2.78,
    b: -2.79,
    c: -0.85,
    d: 2.79,
    range: [-3, 3]
};

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("#container");

    // p5js' mousePressed function applies EventListener to the container not to the canvas
    // so when clicking on the gui within the same container mousePressed event are called
    // and that is not desired
    canvas.elt.addEventListener("click", function(event) {
        if (event.button === 0) {
            // check for left button
            randomParams();
            init();
        }
    });

    BLUE = color("#1E2630");
    RED = color(251, 53, 80, 100);

    stroke(RED);
    strokeWeight(0.5);

    controlKit = new ControlKit();
    controlKit
        .addPanel()
        .addSlider(params, "a", "range", { onChange: init, onFinish: init })
        .addSlider(params, "b", "range", { onChange: init, onFinish: init })
        .addSlider(params, "c", "range", { onChange: init, onFinish: init })
        .addSlider(params, "d", "range", { onChange: init, onFinish: init });

    init();
}

function randomParams() {
    params.a = random(-3.0, 3.0);
    params.b = random(-3.0, 3.0);
    params.c = random(-3.0, 3.0);
    params.d = random(-3.0, 3.0);

    document.querySelectorAll(".wrap-slider>input")[0].value = nf(
        params.a,
        1,
        2
    );
    document.querySelectorAll(".wrap-slider>input")[1].value = nf(
        params.b,
        1,
        2
    );
    document.querySelectorAll(".wrap-slider>input")[2].value = nf(
        params.c,
        1,
        2
    );
    document.querySelectorAll(".wrap-slider>input")[3].value = nf(
        params.d,
        1,
        2
    );
}

function init() {
    background(BLUE);

    iteration = 0;
    x = 0;
    y = 0;
    controlKit.update();
    document.querySelector("#params").innerHTML =
        "<em>a = " +
        nf(params.a, 1, 3) +
        "</em>" +
        "<em>b = " +
        nf(params.b, 1, 3) +
        "</em>" +
        "<em>c = " +
        nf(params.c, 1, 3) +
        "</em>" +
        "<em>d = " +
        nf(params.d, 1, 3) +
        "</em>";
}

function draw() {
    for (var i = 0; i < 1000; i++) {
        x2 = sin(params.a * y) - cos(params.b * x);
        y2 = sin(params.c * x) - cos(params.d * y);
        x = x2;
        y = y2;
        point(map(x2, -2, 2, 50, width - 50), map(y2, -2, 2, 50, height - 50));
    }

    iteration++;
    if (iteration >= 1000) {
        randomParams();
        init();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    init();
}
