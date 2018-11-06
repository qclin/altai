import $ from 'jquery';

var subLines;
var sub2Lines;

var subInterval;
var sub2Interval;

var capLine;
var captionInterval;



getCaption();
/// call this inside model loader, after terrain is loaded
// setTimeout(	getSubtitle, 15000);

function getCaption(){
  $.ajax({
    url: "http://18.207.83.80/text_caption", // TODO: REPLACE HOST
    data: {env: "glacier"},
    success: function(data) {
      console.log( "glacier --- ", data)
      capLine = data.split('.');
      rollCaption();
      captionInterval = setInterval(rollCaption, 5000);
      return data;
    }
  });
}


function getSubtitle(){
  $.ajax({
    url: "http://18.207.83.80/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "trans"},
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
  setTimeout(clearSub, 4000);

  subCount++;
  if (subCount >= subLines.length) {
    subCount = 0;
    clearInterval(subInterval); // stop refreshing after one cycle
  }
}

function clearSub(){
  subtitle.innerHTML = ""
}


/// dialog scene;
function getSubtitle2(){
  $.ajax({
    url: "http://18.207.83.80/text_subtitle", // TODO: REPLACE HOST
    data: {agent: "influencer"},
    success: function(data) {
      console.log("subtitle 22222----- ", data)
      sub2Lines = data.split(',');
      rollSubtitle2(); /// call on both sub &
      sub2Interval = setInterval(rollSubtitle2, 8000);
      return data;
    }
  });
}

var sub2Count = 0;
var sub2title = document.getElementById("subtitle2");

function rollSubtitle2() {
  sub2title.innerHTML = sub2Lines[sub2Count];
  setTimeout(clearSub2, 6000);

  sub2Count++;
  if (sub2Count >= sub2Lines.length) {
    sub2Count = 0;
    clearInterval(sub2Interval); // stop refreshing after one cycle
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
    getSubtitle();
    setTimeout(getSubtitle2, 2000);
  }
}
