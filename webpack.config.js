const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    background: "./src/background.ts",
    content: "./src/content.tsx",
    style: "./src/styles/json-preview.scss",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".tsx"],
    alias: {
      "jq-web": path.resolve("./node_modules/jq-web"),
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      buffer: false,
      path: false,
      stream: false,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(process.env.DEBUG === "true"),
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "" },
        { from: "assets", to: "" },
        { from: "node_modules/jq-web/jq.wasm.wasm", to: "" },
        { from: "LICENSE", to: "" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
