const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

module.exports = {
  entry: {
    server: path.resolve(__dirname, 'src', 'server') + '/main.tsx',
    client: path.resolve(__dirname, 'src', 'client') + '/client.js',
  },
  target: 'node',
  mode: 'development',

  externals: [nodeExternals()],
  node: {
    __dirname: false
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: path.resolve('dist')
  },
  plugins: [new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }), new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
    }),
    new CopyPlugin({
      patterns: [{
        from: "public",
        to: "public",
      }]
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/client/]),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [{
        test: /\.(png|jpg|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: true,
          }
        }, ],
        type: 'javascript/auto'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

    ]
  }
};