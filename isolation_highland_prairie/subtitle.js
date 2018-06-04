import $ from 'jquery';

// var lines = ["guilty", "Away", "giddy", "supported", "Peace", "Sea shell... She sells"]
var lines;
var inst;
testAjax();

function testAjax() {
  $.ajax({
    url: "http://localhost:3333/text",
    data: {agent: "isolation", environment: "highland_pairie" },
    success: function(data) {
      lines = data.split(',');
      change(); /// call on both sub &
      inst = setInterval(change, 5000);
      return data;
    }
  });
}

var subCount = 0;
var subtitle = document.getElementById("subtitle");

// var inst = setInterval(change, 5000);


function change() {
  subtitle.innerHTML = lines[subCount];
  setTimeout(remove, 2000);

  subCount++;
  if (subCount >= lines.length) {
    subCount = 0;
    clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
  }
}

function remove(){
  subtitle.innerHTML = ""
}

var instEnv = setInterval(changeEnvLine, 3000);

var hypCount = 0;

var envLine = ["the planet can win peasants","the maid can dig images","a sky should soar months","the planet can climb oriental religions", "cold, ninth, lovely"]
var hypotitle = document.getElementById("hypotitle");

function changeEnvLine() {
  hypotitle.innerHTML = envLine[hypCount];
  hypCount++;
  if (hypCount >= envLine.length) {
    hypCount = 0;
    clearInterval(instEnv); // uncomment this if you want to stop refreshing after one cycle
  }
}
