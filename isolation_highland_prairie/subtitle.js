import $ from 'jquery';

var subLines;
var subInterval;

var capLine;
var captionInterval;



getCaption();
// getSubtitle(); /// call this inside model loader, after terrain is loaded
// setTimeout(	getSubtitle, 15000);

function getCaption(){
  $.ajax({
    url: "http://34.200.52.167/text_caption", // TODO: REPLACE HOST
    data: {env: "highland_pairie"},
    success: function(data) {
      console.log( "highland_pairie --- ", data)
      capLine = data.split('.');
      captionInterval = setInterval(rollCaption, 5000);
      return data;
    }
  });
}


function getSubtitle(){
  $.ajax({
    url: "http://34.200.52.167/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "isolation"},
    success: function(data) {
      console.log("subtitle ----- ", data)
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
  subtitle.innerHTML = subLines[subCount];
  setTimeout(clearSub, 2000);

  subCount++;
  if (subCount >= subLines.length) {
    subCount = 0;
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
    getSubtitle();
  }
}
