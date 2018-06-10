import $ from 'jquery';

var subLines;
var subInterval;

var capLine;
var captionInterval;


getSubtitle();
// getCaption();
// getSubtitle(); /// call this inside model loader, after terrain is loaded
// setTimeout(	getCaption, 15000);

function getCaption(){
  $.ajax({
    url: "http://localhost:3000/text_caption", // TODO: REPLACE HOST
    data: {env: "highland_forest"},
    success: function(data) {
      console.log( "highland_forest --- ", data)
      capLine = data.split(',');
      captionInterval = setInterval(rollCaption, 5000);
      return data;
    }
  });
}


function getSubtitle(){
  $.ajax({
    url: "http://localhost:3000/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "predator"},
    success: function(data) {
      console.log("subtitle ----- ", data)
      subLines = data.split(',');
      rollSubtitle(); /// call on both sub &
      subInterval = setInterval(rollSubtitle, 10000);
      return data;
    }
  });
}


var subCount = 0;
var subtitle = document.getElementById("subtitle");

function rollSubtitle() {
  subtitle.innerHTML = subLines[subCount];
  setTimeout(clearSub, 5000);

  subCount++;
  if (subCount >= subLines.length) {
    subCount = 0;
    setTimeout(	getCaption, 5000);
    clearInterval(subInterval); // stop refreshing after one cycle
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
    clearInterval(captionInterval); // stop refreshing after one cycle
    clearCaption();
  }
}


function clearCaption(){
  hypotitle.innerHTML = ""
}
