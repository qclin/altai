const webpack = require('webpack');
var path = require('path');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';


module.exports = {
  context: __dirname,
  // Include the hot middleware with each entry point
  entry: {
		place_bundle: ['./place/main.js', hotMiddlewareScript],
    realm_bundle: ['./realm/main.js', hotMiddlewareScript],
    flat_bundle: ['./flat/main.js', hotMiddlewareScript],
    check_model_bundle: ['./check_model/main.js', hotMiddlewareScript],
    couple_recognition_tundra_bundle: ['./couple_recognition_tundra/main.js', hotMiddlewareScript],
    predator_highland_forest_bundle: ['./predator_highland_forest/main.js', hotMiddlewareScript],
    trans_influencer_glacier_bundle: ['./trans_influencer_glacier/main.js', hotMiddlewareScript],
    isolation_highland_prairie_bundle: ['./isolation_highland_prairie/main.js', hotMiddlewareScript]
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
      },{
          test: /\.ttf$/,
          use: [
            {
              loader: 'ttf-loader',
              options: {
                name: './font/[hash].[ext]',
              },
            },
          ]
      }]
  },
  resolve: {
    extensions: ['.js', '.sass'],
    modules: ['node_modules']
  },
  devServer: {
    historyApiFallback: true,
    headers: {
         'Access-Control-Allow-Origin': '*'
     }
  },
	plugins: [
		 new webpack.HotModuleReplacementPlugin(),
     new webpack.NoEmitOnErrorsPlugin()
	],
  mode: 'development',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    // tls: 'empty'
  }
};
