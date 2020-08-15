const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    module: {
      rules: [
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
        },
        {
          test: /\.tsx?$/,
          loader: "awesome-typescript-loader",
          options : {
            reportFiles: [
              'src/ts/**/*.{ts,tsx}'
            ]
          },
        },
        {
          test: /\.js$/,
          loader: "source-map-loader"
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    entry: './src/ts/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'src/static'),
      compress: true,
      port: 3000,
      publicPath: "/"
    },
    externals: {
      oimo: true
    },
    plugins: [new CleanWebpackPlugin()]
  };
};