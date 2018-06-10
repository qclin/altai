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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));


app.get('/', function(req, res){
  var dummy ="dummy dummy "
    res.sendFile(__dirname + '/index.html');
});


app.get('/place', function(req, res){
  var dummy ="dummy dummy "
    res.sendFile(__dirname + '/place/index.html');
});

app.get('/realm', function(req, res){
    res.sendFile(__dirname + '/realm/index.html');
});


app.get('/check_model', function(req, res){
    res.sendFile(__dirname + '/check_model/index.html');
});

// app.get('/:agents/:environment', function(req, res){
//   var path = [req.params.agents, req.params.environment].join('_');
//   console.log(" test test test", req.params, path);
//   res.sendFile(__dirname + `/${path}/index.html`);
// });

app.get('/dwelling', function(req, res){
    res.sendFile(__dirname + '/isolation_highland_prairie/index.html');
});

app.get('/pleasure-hunting', function(req, res){
    res.sendFile(__dirname + '/predator_highland_forest/index.html');
});

app.get('/sensing', function(req, res, next){
    res.sendFile(__dirname + '/couple_recognition_tundra/index.html');
});

app.get('/baptism', function(req, res){
    res.sendFile(__dirname + '/trans_influencer_glacier/index.html');
});


app.get('/text_caption', function(req, res){
    var env = req.query.env
    // console.log( "-----Server side---text_caption--  env --------- ", env);
    var pamphlet = utterances.generateCaption(env);
    pamphlet.then(function(data){
      // console.log("00000 text_caption, returned pamphlets ::: ", data, typeof data);
      // database.addNewEntry(data) // TODO: // update Firebase structure

      var predictedText = data.toString();
      res.json(predictedText);

    });
});


app.get('/text_subtitle', function(req, res){
    var agent = req.query.agent
    // console.log( "-----Server side---text_subtitle-- agent --------- ", agent);
    var pamphlet = utterances.generateSubtitle(agent);
    pamphlet.then(function(data){
      // console.log("00000 text_subtitle, returned pamphlets ::: ", data, typeof data);
      // database.addNewEntry(data) // TODO: // update Firebase structure

      var predictedText = data.toString();
      res.json(predictedText);

    });
});



var listerner = app.listen(process.env.PORT || 80, function() {
	console.log("Listening on port %d", listerner.address().port);
});
