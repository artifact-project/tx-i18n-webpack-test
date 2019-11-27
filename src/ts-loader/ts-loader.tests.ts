import * as fs from 'fs';
import * as webpack from 'webpack';
import webpackConfig from '../../fixture/webpack.config';
import { i18nTx, i18nExtractor } from 'tx-i18n/webpack';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15e3;

const localeOutput = `${__dirname}/ts-loader.phrases.json`;
const compiler = webpack({
	...webpackConfig({
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
			options: {
				transpileOnly: true,
				getCustomTransformers: () => ({
					before: [
						i18nTx({}),
					],
					after: [],
				}),
			},
		}],
	}),

	plugins: [
		new i18nExtractor({
			output: localeOutput,
		}),
	],
});

it('ts-loader: Extract', async () => {
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
				const content = fs.readFileSync(localeOutput) + '';

				expect(JSON.parse(content)).toEqual({
					default: {
						'Демо': 'Демо',
						'Мы рады видеть тебя!': 'Мы рады видеть тебя!',
						'Привет, <1><#2></1>!': 'Привет, <1><#2></1>!',
						'Рубаха': 'Рубаха',
					},
				});

				resolve();
			}));
		});
	});
});
