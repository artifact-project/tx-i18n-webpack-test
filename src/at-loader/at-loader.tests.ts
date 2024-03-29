import * as fs from 'fs';
import * as webpack from 'webpack';
import webpackConfig from '../../fixture/webpack.config';
import { i18nTx, i18nExtractor } from 'tx-i18n/webpack';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15e3;


const localeOutput = `${__dirname}/at-loader.phrases.json`;
const compiler = webpack({
	...webpackConfig({
		rules: [{
			test: /\.tsx?$/,
			loader: 'awesome-typescript-loader',
			exclude: /node_modules/,
			options: {
				getCustomTransformers: () => ({
					before: [ i18nTx({}) ],
					after: [],
				}),
			},
		}],
	}),

	plugins: [ new i18nExtractor({ output: localeOutput }) ],
});

it('at-loader: Extract', async () => {
	await new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err || stats.hasErrors()) {
				console.log(stats.toString({
					colors: true,
				}))
				reject(err);
				return;
			}

			resolve(new Promise(resolve => {
				const actual = require(localeOutput);
				const expected = require('../../fixture/example.phrases.json');

				expect(actual).toEqual(expected);
				resolve();
			}));
		});
	});
});
