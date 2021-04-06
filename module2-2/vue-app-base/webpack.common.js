const path = require("path");

const VueLoaderPlugin = require("vue-loader/lib/plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

//公共的打包配置
module.exports = {
  //入口文件
  entry: "./src/main.js",
  //打包出口文件 这个里面我们需要用到__dirname来生成一个绝对路径
  output: {
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
        // 预处理
        enforce: "pre"
      },
      {
        test: /\.vue$/,
        //用于解析vue文件
        use: ["vue-loader"]
      },
      {
        test: /\.js$/,
        //刨除node_modules中的js代码
        exclude: /node_modules/,
        //对于js代码，我们需要使用babel-loader来进行代码的转换编译
        use: ["babel-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //对于文件的复制
        loader: "url-loader",
        //限制最大为10k 超过10K还是按文件存储，不会转换为base64
        options: {
          limit: 10 * 1024,
          //一定要加这个 不然src中会是一个object module
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
