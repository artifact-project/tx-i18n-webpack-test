import { Configuration } from 'webpack';


export default (module: Configuration['module']): Configuration => ({
	entry: `${__dirname}/example.tsx`,

	output: {
		path: __dirname,
		filename: 'example.output.js',
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},

	node: {
		Buffer: false,
	},

	module,
});