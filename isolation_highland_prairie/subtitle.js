import $ from 'jquery';

var subLines;
var subInterval;

var captionInterval;
var subtitleInterval;

var capLine;

getCaption();
getSubtitle();

function getCaption(){
  $.ajax({
    url: "http://localhost:3000/text_caption", // TODO: REPLACE HOST
    data: {env: "highland_pairie"},
    success: function(data) {
      capLine = data.split(',');
      rollCaption(); /// call on both sub &
      captionInterval = setInterval(rollCaption, 5000);
      return data;
    }
  });
}


function getSubtitle(){
  $.ajax({
    url: "http://localhost:3000/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "isolation"},
    success: function(data) {
      subLines = data.split(',');
      rollSubtitle(); /// call on both sub &
      subInterval = setInterval(rollSubtitle, 5000);
      return data;
    }
  });
}


var subCount = 0;
var subtitle = document.getElementById("subtitle");

function rollSubtitle() {
  subtitle.innerHTML = subLine[subCount];
  setTimeout(clearSub, 2000);

  subCount++;
  if (subCount >= lines.length) {
    subCount = 0;
    clearInterval(inst); // stop refreshing after one cycle
  }
}

function clearSub(){
  subtitle.innerHTML = ""
}


var capCount = 0;
var hypotitle = document.getElementById("hypotitle");


function rollCaption() {
  hypotitle.innerHTML = capLine[capCount];
  capCount++;
  if (capCount >= capLine.length) {
    capCount = 0;
    clearInterval(instEnv); // stop refreshing after one cycle
  }
}
