import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'background/background.js',
  output: {
    file: 'dist/background.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
  ],
};
