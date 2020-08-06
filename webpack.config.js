const path = require('path');

module.rules = [
  {
    test: /\.(gltf)$/,
    use: [
      {
        loader: "gltf-webpack-loader"
      }
    ]
  },
  {
    test: /\.(bin)$/,
    use: [
      {
        loader: 'file-loader',
        options: {}
      }
    ]
  }
];

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'src/static'),
    compress: true,
    port: 3000,
    publicPath: "/"
  }
}