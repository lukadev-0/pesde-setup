import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
	input: "src/index.ts",
	output: {
		file: "dist/index.js",
		format: "esm"
	},
	treeshake: true,

	external: (id) => /^node:/.test(id),
	plugins: [
		commonjs(),
		json(),
		tsConfigPaths(),
		nodeResolve({ preferBuiltins: true, extensions: [".js", ".ts", ".json"] }),
		esbuild({ target: "node20", tsconfig: "tsconfig.json" })
	]
});
