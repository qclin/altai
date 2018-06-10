var fs = require('fs')
var spawn = require("child_process").spawn;
var PythonShell = require('python-shell');

module.exports = {
  // couple_recognition_tundra
  // predator_highland_forest
  // trans influencer glacier
  // isolation highland prairie
  generateCaption : function (env){
      let runPy = new Promise(function(resolve, reject){
      console.log("utterances --js--- ", env);
      PythonShell.run(`./nlpSlam/environment_story/gen_${env}.py`, function (err, results) {
          if (err) reject(err);
          console.log('environment_story results: %j', results);
          resolve(results);
        });
      });
      return runPy;
  },

  generateSubtitle : function (agent){
      let runPy = new Promise(function(resolve, reject){
      console.log("utterances --js--- ", agent);

      PythonShell.run(`./nlpSlam/agent_story/gen_${agent}.py`, function (err, results) {
          if (err) reject(err);
          console.log('agent_story results: %j', results);
          resolve(results);
        });
      });
      return runPy;
  }

}
