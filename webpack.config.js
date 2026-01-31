const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: 'development',
  entry: "./app/javascripts/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/"),
      "vm": require.resolve("vm-browserify"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./app/index.html", to: "index.html" },
        { from: "./app/stylesheets/app.css", to: "app.css" },
        { from: "./app/stylesheets/modern.css", to: "modern.css" },
        { from: "./app/images", to: "images" },
      ],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8080,
  },
};
