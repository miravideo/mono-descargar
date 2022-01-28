const webpack = require('webpack')
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const os = require('os')
const RemoveSourceMapUrlWebpackPlugin = require('@rbarilani/remove-source-map-url-webpack-plugin');
const base = __dirname;

function getBuild() {
  var date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}.${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
}

const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      { from: '*.user.js', to: './', transform(content) {
        return content
          .toString()
          .replace('$VERSION', getBuild())
          .replace('$BUILD', getBuild());
      },},
    ],
  }),
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new RemoveSourceMapUrlWebpackPlugin({
    test: /.*\.js$/
  }));
}

module.exports = {
  entry: {
    'mono': ['./src/mono.js'],
  },
  output: {
    filename: process.env.NODE_ENV === 'production' ? `[name].min.js` : `[name].js`,
    path: path.resolve(base, 'dist'),
    library: 'mono-descargar',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json', '.ts'],
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    // 它会应用到普通的 `.js` 文件
    // 以及 `.vue` 文件中的 `<script>` 块
    {
        test: /\.js$/,
        loader: 'babel-loader'
    },
    // 它会应用到普通的 `.css` 文件
    // 以及 `.vue` 文件中的 `<style>` 块
    {
      test: /\.css$/,
      use: [
        { loader: "style-loader", options: { attributes: { mira: "mono-descargar" } } },
        'css-loader',
      ]
    },
    {
      test: /\.less$/,
      use: [
        { loader: "style-loader", options: { attributes: { mira: "mono-descargar" } } },
        'css-loader',
        'less-loader',
      ]
    }
    ]
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  plugins,
  watchOptions: {
    ignored: /dist/
  },
  externals: {
  },
};
