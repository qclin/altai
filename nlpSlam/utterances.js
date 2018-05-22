var fs = require('fs')
var spawn = require("child_process").spawn;
var PythonShell = require('python-shell');

module.exports = {
  generateText : function (agentType){
      let runPy = new Promise(function(resolve, reject){
      console.log("", agentType)
        PythonShell.run('./nlpSlam/queer_story.py', function (err, results) {
          if (err) reject(err);
          console.log('results: %j', results);
          resolve(results);
        });
      });
      return runPy;

    // pythonProcess.stdout.on('data', function (data){
    // // Do something with the data returned from python script
    //   // console.log('pythonProcess:::', data);
    //   var interpreted = decodeURIComponent(data);
    //   console.log('interpreted :::', interpreted, typeof interpreted);
    //   return interpreted
    //
    // });
    // return sentence
  }
}
