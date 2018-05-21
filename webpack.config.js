const webpack = require('webpack');
var path = require('path');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';


module.exports = {
  context: __dirname,
  // Include the hot middleware with each entry point
  entry: {
		place_bundle: ['./place/main.js', hotMiddlewareScript],
    realm_bundle: ['./realm/main.js', hotMiddlewareScript]

	},
  output: {
    path: __dirname,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'cheap-module-source-map',
//  devtool: 'source-map', //for production?
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      },{
        test: /\.sass$/,
        loaders: [
          'style',
          'css',
          'sass?outputStyle=expanded'
        ]
      },{
        test: /\.obj$/,
        loader: 'url-loader'
      },{
        test: /\.html$/,
        loader: 'html-loader?attrs[]=video:src'
      },{
        test: /\.mp4$/,
        loader: 'url?limit=10000&mimetype=video/mp4'
      }]
  },
  resolve: {
    extensions: ['.js', '.sass'],
    modules: ['node_modules']
  },
  devServer: {
    historyApiFallback: true
  },
	plugins: [
		 new webpack.HotModuleReplacementPlugin(),
     new webpack.NoEmitOnErrorsPlugin()
	],
  mode: 'development'

};
