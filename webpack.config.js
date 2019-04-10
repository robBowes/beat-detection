const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
        options: {
          plugins: ["syntax-dynamic-import"],
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false
              }
            ]
          ]
        },
        test: /\.js$/
      },
      {
        test: /\.(scss|css)$/,

        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  output: {
    chunkFilename: "[name].[hash].js",
    filename: "[name].[hash].js",
    // publicPath: '/assets/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "BPM analysis",
      inject: false,
      mobile: true,
      scripts: [
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.sound.js",
        // "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.12.0/matter.min.js"
      ],
      template: "./src/template.html"
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },
      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "assets"),
    compress: true,
    port: 8000,
    // publicPath : path.join(__dirname, "assets"),
	},
	devtool: "source-map"
}
