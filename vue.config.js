
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    entry: {
      index: ['./src/main.js'],
    //   background: './background/background.js',
    },
    resolve: {
      alias: {
        background: path.resolve(__dirname, 'background'),
        ui: path.resolve(__dirname, 'src'),
        public: path.resolve(__dirname, 'public'),
      },
      extensions: ['.js', '.vue'],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'background/manifest.json',
          to: 'manifest.json',
        },
        { from: 'background/_locales', to: '_locales' },
      ]),
    ],
  },
};

