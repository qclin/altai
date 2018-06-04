var express = require('express');
var fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser');
var pug = require('pug');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var utterances = require('./nlpSlam/utterances');
var database = require('./nlpSlam/database/firestore');

var app = express();
app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json({extended: false}));


app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));


app.get('/place', function(req, res){
  var dummy ="dummy dummy "
    res.sendFile(__dirname + '/place/index.html');
});

app.get('/realm', function(req, res){
    res.sendFile(__dirname + '/realm/index.html');
});

app.get('/glacier', function(req, res){
    res.sendFile(__dirname + '/glacier/index.html');
});

app.get('/check_model', function(req, res){
    res.sendFile(__dirname + '/check_model/index.html');
});

// app.get('/:agents/:environment', function(req, res){
//   var path = [req.params.agents, req.params.environment].join('_');
//   console.log(" test test test", req.params, path);
//   res.sendFile(__dirname + `/${path}/index.html`);
// });

app.get('/isolation_highland_prairie', function(req, res){
    res.sendFile(__dirname + '/isolation_highland_prairie/index.html');
});

app.get('/predator_highland_forest', function(req, res){
    res.sendFile(__dirname + '/predator_highland_forest/index.html');
});

app.get('/couple_recognition_tundra', function(req, res){
    res.sendFile(__dirname + '/couple_recognition_tundra/index.html');
});

app.get('/text', function(req, res){
    var agent = req.query.agent
    var environment = req.query.env
    console.log( "---------- agent, env --------- ", agent, environment);

    var agentType = "isolation";
    var pamphlet = utterances.generateText(agentType);
    pamphlet.then(function(data){
      console.log("00000, returned pamphlets ::: ", data, typeof data);
      database.addNewEntry(data)

      var predictedText = data.toString();
      res.json(predictedText);

    });
});



var listerner = app.listen(process.env.PORT || 3333, function() {
	console.log("Listening on port %d", listerner.address().port);
});
