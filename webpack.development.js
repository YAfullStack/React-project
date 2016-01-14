const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const stylesheetsLoader = ExtractTextPlugin.extract('style-loader', '!css-loader?modules&localIdentName=[path]-[local]-[hash:base64:3]');
const stylesheetsPlugin = new ExtractTextPlugin('[hash].css');
const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: './src/index.html' });
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV == 'development' || 'true'))
});

module.exports = {
  context: __dirname + '/src',
  entry: './index',
  output: {
    filename: '[hash].js',
    path: __dirname + '/dist'
  },
  devtool: 'eval',
  debug: true,
  plugins: [ stylesheetsPlugin, htmlWebpackPlugin, definePlugin ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:
        {
          presets:['react', 'es2015', 'stage-0']
        },
        plugins: ['react-transform', {
          transforms: [
            {
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module'],
            }, {
              transform: 'react-transform-catch-errors',
              imports: ['react', 'redbox-react'],
            },
          ]
        }]
      },
      { test: /\.css$/, loader: stylesheetsLoader },
      { test: /\.scss$/, loader: `${stylesheetsLoader}'!sass` },
      { test: /\.sass$/, loader: `${stylesheetsLoader}'!sass?indentedSyntax=sass` },
      { test: /\.less$/, loader: `${stylesheetsLoader}'!less` },
      { test: /\.html$/, loader: 'file?name=[name].[ext]' }
    ]
  },
  devServer: {
    historyApiFallback: true,
  }
};
