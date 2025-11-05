import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";

const plugins = [
	commonjs(),
	json(),
	tsConfigPaths(),
	nodeResolve({ preferBuiltins: true, extensions: [".js", ".ts", ".json"] }),
	esbuild({ target: "node20", tsconfig: "tsconfig.json" })
];

export default defineConfig([
	// actions entrypoint
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.js",
			format: "esm"
		},

		treeshake: true,
		external: (id: any) => /^node:/.test(id),
		plugins
	},

	// cli entrypoint
	{
		input: "src/bin.ts",
		output: {
			file: "dist/bin.js",
			format: "esm",
			sourcemap: true
		},

		treeshake: true,
		external: [...Object.keys(pkg.dependencies || {})],
		plugins
	}
]);
