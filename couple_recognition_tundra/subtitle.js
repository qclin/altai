import $ from 'jquery';

var subLines;
var subInterval;
var sub2Lines;
var sub2Interval;


var capLine;
var captionInterval;

getCaption();
getSubtitle(); /// call this inside model loader, after terrain is loaded
// setTimeout(	getSubtitle2, 15000);
// getSubtitle2();

function getCaption(){
  $.ajax({
    url: "http://34.200.52.167:3000/text_caption", // TODO: REPLACE HOST
    data: {env: "tundra"},
    success: function(data) {
      console.log( "tundra --- ", data)
      capLine = data.split('.');
      captionInterval = setInterval(rollCaption, 5000);
      return data;
    }
  });
}


function getSubtitle(){
  $.ajax({
    url: "http://34.200.52.167:3000/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "recognition"},
    success: function(data) {
      subLines = data.split(',');
      rollSubtitle(); /// call on both sub &
      subInterval = setInterval(rollSubtitle, 1000);
      setInterval(clearSub, 8000);
      return data;
    }
  });
}

var subCount = 0;
var subtitle = document.getElementById("subtitle");

function rollSubtitle() {
  subtitle.innerHTML += subLines[subCount];
  subCount++;
  if (subCount >= subLines.length) {
    subCount = 0;
    clearInterval(subInterval); // stop refreshing after one cycle
    getSubtitle()
  }
}

function clearSub(){
  subtitle.innerHTML = ""
}

/// dialog scene;
function getSubtitle2(){
  $.ajax({
    url: "http://34.200.52.167:3000/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "couple"},
    success: function(data) {
      console.log("subtitle ----- ", data)
      sub2Lines = data.split(',');
      rollSubtitle2(); /// call on both sub &
      sub2Interval = setInterval(rollSubtitle2, 2000);
      setInterval(clearSub2, 10000);

      return data;
    }
  });
}

var sub2Count = 0;
var sub2title = document.getElementById("subtitle2");

function rollSubtitle2() {
  sub2title.innerHTML += "<br>" + sub2Lines[sub2Count];

  sub2Count++;
  if (sub2Count >= sub2Lines.length) {
    sub2Count = 0;
    clearInterval(sub2Interval);
    clearSub2();
    setTimeout(getSubtitle2, 10000);
  }
}

function clearSub2(){
  sub2title.innerHTML = ""
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
    getSubtitle2()
  }
}

function clearCaption(){
  hypotitle.innerHTML = ""
}
