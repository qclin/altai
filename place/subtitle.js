



// var agent1 = ["There was mountain floating somewhere on horizon.", "When newt came across the siren, the earth was crumbling.", "The scene brought to mind ritual dance.", "The newt was feeding the siren.", "It took a month.", "Then a moonlight came,", "and newt with siren resolved to return to Chinese."]


var agent1 = ["maccormack", "gay", "marriage may take politics", "a context will disrupt singularities", "if animals will stabilise assembling i will find mash"];
var agent2 = "And you can see it only in a prepared piece of white material and carefully protected from the divine energy of the Altaians, were supposed to ascend it only in a prepared piece of white material and carefully transported home, where it is on this mountain is the Mountain of Nine Questions. The daughters of the names given to it by the Altaians themselves is Tsagan-Ubugun - The White Old Man. The gray-haired head of the belt - the Arctic, the Pacific and the globe rivers flood and men turn into fish and turtles. Who can judge a thousand years is long and so a morning and an evening count. The four oceans boil and clouds suddenly rip the sky and warlords clash. War again. Rancor rains down on men who dream of the ninth day of the topmost branch the plum tree is pleased with snow and doesn't care about freezing or dying houseflies. On our small planet a few houseflies bang on the Sun, fearing not to notice the solemn moment of the Altai. In his diaries the traveler, for example, mentions kereksurah (grazing hills, poured from large stones), stelae of nameless people, deer stones (mysterious plates covered with images"

var counter = 0;
var elem = document.getElementById("subtitle1");
var stamp = document.getElementById("subtitle2");
var blocker = document.getElementById( 'blocker' );
var inst;

if(blocker.style.display == 'none'){
  setInterval(change, 5000);
}else{
  clearInterval(inst);
}

function start(){
  setInterval(change, 5000);
}

function stop(){
  clearInterval(inst);
}


var sp;
function change() {
  elem.innerHTML = agent1[counter];
  setTimeout(remove, 2000);
  sp = getRandomInt(4500);
  console.log(" sporatdic time :::",sp )
  setTimeout(seen, sp);
  counter++;
  if (counter >= agent1.length) {
    counter = 0;
    // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
  }
}

function remove(){
  elem.innerHTML = ""
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


var act = ["✓", "✓✓", "✖", "..."]
function seen() {
  var date = new Date();
  var timestamp = date.toLocaleTimeString();
  var pre = act[getRandomInt(3)]
  stamp.innerHTML = pre+ "  " + timestamp
  setTimeout(removeTime, 5000-sp);
}

function removeTime(){
  stamp.innerHTML = ""
}

module.exports ={
  start, stop
}
