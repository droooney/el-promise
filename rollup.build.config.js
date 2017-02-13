const path = require('path');
const npm = require('rollup-plugin-node-resolve');
const eslint = require('rollup-plugin-eslint');
const babel = require('rollup-plugin-babel');

module.exports = {
  entry: './browser.js',
  dest: './build/promise.js',
  format: 'iife',
  moduleName: 'Promise',
  sourceMap: true,
  plugins: [
    npm({
      browser: true,
      preferBuiltins: false
    }),
    eslint({
      throwError: true
    }),
    babel()
  ]
};
