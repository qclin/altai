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



var listerner = app.listen(process.env.PORT || 3333, function() {
	console.log("Listening on port %d", listerner.address().port);
});
