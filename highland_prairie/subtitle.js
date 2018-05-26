

var lines = ["guilty", "Away", "giddy", "supported", "Peace", "Sea shell... She sells"]

var counter = 0;
var elem = document.getElementById("subtitle");
var inst = setInterval(change, 5000);

function change() {
  elem.innerHTML = lines[counter];
  setTimeout(remove, 2000);
  counter++;
  if (counter >= lines.length) {
    counter = 0;
    // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
  }
}

function remove(){
  elem.innerHTML = ""
}
