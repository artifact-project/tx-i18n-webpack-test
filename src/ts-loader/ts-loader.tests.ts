import * as webpack from 'webpack';
import * as MemoryFS from 'memory-fs';
import webpackConfig from '../../fixture/webpack.config';
import { i18nTx, i18nExtractor } from 'tx-i18n/webpack';

const fs = new MemoryFS();
const localeOutput = `${__dirname}/ts-phrases.json`;
const compiler = webpack({
	...webpackConfig({
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
			options: {
				getCustomTransformers: () => ({
					before: [
						i18nTx({
							packageName: `${__dirname}/../i18n/i18n`,
						}),
					],
					after: [],
				}),
			},
		}],
	}),

	plugins: [
		new i18nExtractor({
			output: localeOutput,
			outputFileSystem: fs,
		}),
	],
});

compiler.outputFileSystem = fs;

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

				console.log(content)
				// expect(JSON.parse(content)).toEqual({
				// 	default: {
				// 		'Демо': 'Демо',
				// 		'Мы рады видеть тебя!': 'Мы рады видеть тебя!',
				// 		'Привет, <1><#2></1>!': 'Привет, <1><#2></1>!',
				// 		'Рубаха': 'Рубаха',
				// 	},
				// });

				resolve();
			}));
		});
	});
});
