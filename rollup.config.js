import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.mjs';
const output = [
	{ file: 'index.js', format: 'cjs', strict: false },
	{ file: 'index.mjs', format: 'esm', strict: false }
];
const plugins = [
	babel(),
	terser()
];

export default { input, output, plugins };
