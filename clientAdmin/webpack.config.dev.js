/**
 * Created by yzdd on 2018/4/2.
 */
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBrowserWebpackPlugin = require("open-browser-webpack-plugin");
const publicPath = '/';
const buildPath = '/';

module.exports = {
  entry: {
    bundle: './src/index.js',//入口文件
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
    chunkFilename: 'chunk.[name].js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader", {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
            }
          }]
      },
      {
        test: /\.less$/,
        use:
          [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
              }
            },
            "less-loader"
          ]
      },
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg|ttf|woff)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 50000,
            outputPath: 'images/'
          }
        }]
      }
    ]
  },
  devServer: {
    publicPath: publicPath,
    contentBase: path.resolve(__dirname, buildPath),
    inline: true,
    hot: true,
    historyApiFallback: true,
    progress: true,
    port: 9090, //端口你可以自定义,
    proxy: {
      '/admin/*': {
        target: 'http://localhost:5757/',
        secure: false,
        changeOrigin: true,
        logLevel: "debug",
      },
    }
  },
  plugins: [
    //开发环境热替换
    new webpack.HotModuleReplacementPlugin(),
    //开发环境不需要分离文件
    //分离出style css文件
    // new ExtractTextPlugin('style.css', {
    //   allChunks: true
    // }),
    //分离出公共的chunk文件
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor', 'manifest'],
    //   filename: "[name].js"
    // }),
    //然后是通过声明变量,使得引用的文件打包提及最小
    //声明webpack打包时的全局变量
    //生产环境production
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    //然后是通过文件压缩插件，进一步压缩文件体积
    //使用插件uglifyjs-webpack-plugin
    //开发环境不需要
    // new UglifyjsWebpackPlugin(),
    //开发环境不需要
    // new CleanWebpackPlugin(path.resolve(__dirname, "dist")),
    // 使用html-webpack-plugin来建立模版文件
    new HtmlWebpackPlugin({
      template: "./view/index.html",
      title: "react-start-kit"
    }),
    new OpenBrowserWebpackPlugin({url: "http://localhost:9090"})
  ]
};