import { resolve, join } from 'path';
import { promises as fs } from 'fs';
import url from 'url';
import { readEnvFiles } from './environment.js';
import { compileSingleModule } from './compile-single-module.js';
import { debug } from './output-utils.js';

/**
 * @param {Partial<Options>} options
 * @param {Mode} mode
 * @returns {Promise<Options>}
 */
export async function normalizeOptions(options, mode) {
	options.cwd = resolve(options.cwd || '');
	process.chdir(options.cwd);

	options.root = options.cwd;

	options.plugins = [];
	options.output = [];
	options.middleware = [];
	options.features = { preact: true };

	// `wmr` / `wmr start` is a development command.
	// `wmr build` / `wmr serve` are production commands.
	const prod = mode !== 'start';
	options.prod = prod;
	options.mode = mode;

	const NODE_ENV = process.env.NODE_ENV || (prod ? 'production' : 'development');
	options.env = await readEnvFiles(options.root, ['.env', '.env.local', `.env.${NODE_ENV}`, `.env.${NODE_ENV}.local`]);

	// Output directory is relative to CWD *before* ./public is detected + appended:
	options.out = resolve(options.cwd, options.out || '.cache');

	// Files in the output directory are served if no middleware overrides them:
	options.overlayDir = options.out;

	// Ensure the output directory exists so that writeFile() doesn't have to create it:
	// Note: awaiting the promise later lets it run in parallel with the CWD check below.
	const ensureOutDirPromise = fs.mkdir(options.out, { recursive: true }).catch(err => {
		console.warn(`Warning: Failed to create output directory: ${err.message}`);
	});

	options.public = options.public || 'public';
	options.publicPath = options.publicPath || '/';

	// https://cdn.example.com => https://cdn.example.com/
	if (!options.publicPath.endsWith('/')) {
		options.publicPath += '/';
	}

	// If the CWD has a public/ directory, all files are assumed to be within it.
	// From here, everything except node_modules and `out` are relative to public:
	if (options.public !== '.' && (await isDirectory(join(options.cwd, options.public)))) {
		options.cwd = join(options.cwd, options.public);
	}

	await ensureOutDirPromise;

	const pkgFile = resolve(options.root, 'package.json');
	const pkg = fs.readFile(pkgFile, 'utf-8').then(JSON.parse);
	options.aliases = (await pkg.catch(() => ({}))).alias || {};

	const hasTsConfig = await isFile(resolve(options.root, 'wmr.config.ts'));
	const hasMjsConfig = await isFile(resolve(options.root, 'wmr.config.mjs'));

	let custom;
	if (hasTsConfig) {
		const resolved = resolve(options.root, 'wmr.config.ts');
		await compileSingleModule(resolved, { cwd: options.cwd, out: resolve('.'), hmr: false });
		const output = resolve('.', 'wmr.config.js');
		const fileUrl = url.pathToFileURL(output);
		custom = await eval('(x => import(x))')(fileUrl);
		fs.unlink(output);
	} else if (hasMjsConfig || (await isFile(resolve(options.root, 'wmr.config.js')))) {
		let initialConfigFile = hasMjsConfig ? 'wmr.config.mjs' : 'wmr.config.js',
			initialError;
		try {
			const resolved = resolve(options.root, initialConfigFile);
			const fileUrl = url.pathToFileURL(resolved);
			// Note: the eval() below is to prevent Rollup from transforming import() and require().
			// Using the native functions allows us to load ESM and CJS with Node's own semantics.
			try {
				custom = await eval('(x => import(x))')(fileUrl);
			} catch (err) {
				console.log(err);
				initialError = err;
				custom = eval('(x => require(x))')(fileUrl);
			}
		} catch (e) {
			if (hasMjsConfig || !/import statement/.test(e)) {
				throw Error(`Failed to load ${initialConfigFile}\n${initialError}\n${e}`);
			}
		}
	}

	Object.defineProperty(options, '_config', { value: custom });

	/**
	 * @param {keyof import('wmr').Plugin} name
	 * @param {import('wmr').Plugin[]} plugins
	 */
	const runConfigHook = async (name, plugins) => {
		for (const plugin of plugins) {
			if (!plugin[name]) return;

			const res = await plugin[name](options);
			if (res) {
				if (res.plugins) {
					throw new Error(`In plugin ${plugin.name}: Plugin method "${name}()" must not return a "plugins" property.`);
				}
				options = mergeConfig(options, res);
			}
		}
	};

	/**
	 * @param {any} x
	 * @returns {x is import('wmr').Plugin}
	 */
	const isPlugin = x => Object.keys(x).some(key => typeof x[key] === 'function');

	/**
	 * @param {Options | import('wmr').Plugin | import('wmr').Plugin []} res
	 */
	const applyConfigResult = res => {
		if (res) {
			if (Array.isArray(res) || isPlugin(res)) {
				options.plugins = options.plugins.concat(res);
			} else {
				options = mergeConfig(options, res);
			}
		}
	};

	if (custom) {
		if (custom.default) {
			const res = await custom.default(options);
			applyConfigResult(res);
		}
		if (custom[mode]) {
			const res = await custom[mode](options);
			applyConfigResult(res);
		}
	}

	// Sort plugins by "enforce" phase. Default is "normal".
	// The execution order is: "pre" -> "normal" -> "post"
	if (options.plugins) {
		options.plugins = options.plugins.flat().sort((a, b) => {
			const aScore = a.enforce === 'post' ? 1 : a.enforce === 'pre' ? -1 : 0;
			const bScore = b.enforce === 'post' ? 1 : b.enforce === 'pre' ? -1 : 0;
			return aScore - bScore;
		});
	}

	debug('wmr:config')(options);

	await runConfigHook('config', options.plugins);
	await runConfigHook('configResolved', options.plugins);

	// @ts-ignore-next
	return options;
}

/**
 * Deeply merge two config objects
 * @template {Record<string, any>} T
 * @template {Record<string, any>} U
 * @param {T} a
 * @param {U} b
 * @returns {T & U}
 */
function mergeConfig(a, b) {
	/** @type {any} */
	const merged = { ...a };

	for (const key in b) {
		const value = b[key];
		if (value == null) {
			continue;
		}

		const existing = merged[key];
		if (Array.isArray(existing) && Array.isArray(value)) {
			merged[key] = [...existing, ...value];
		} else if (existing !== null && typeof existing === 'object' && typeof value === 'object') {
			merged[key] = mergeConfig(existing, value);
		} else {
			merged[key] = value;
		}
	}

	return merged;
}

function isDirectory(path) {
	return fs
		.stat(path)
		.then(s => s.isDirectory())
		.catch(() => false);
}

function isFile(path) {
	return fs
		.stat(path)
		.then(s => s.isFile())
		.catch(() => false);
}
