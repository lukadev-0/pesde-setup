import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { currentSystem as currentOS } from "@/heuristics/os.js";
import { currentSystem as currentArch } from "@/heuristics/arch.js";

export const PESDE_PACKAGE_DIRS = [
	join(process.env.GITHUB_WORKSPACE!, "luau_packages"),
	join(process.env.GITHUB_WORKSPACE!, "lune_packages"),
	join(process.env.GITHUB_WORKSPACE!, "roblox_packages"),
	join(process.env.GITHUB_WORKSPACE!, "roblox_server_packages")
];

export async function cacheKey(): Promise<string> {
	const hashFiles = async (...paths: string[]) => {
		const hash = createHash("sha256");
		const contents = await Promise.all(
			paths.map(async (path) => {
				try {
					const buf = await readFile(path);
					return buf.toString();
				} catch (err) {
					const e = err as NodeJS.ErrnoException;
					if (e.code === "ENOENT") {
						return `missing(${e.path})`;
					}

					throw err;
				}
			})
		);

		for (const text of contents) hash.update(text);

		return hash.digest("hex");
	};

	return `pesde-${currentOS()}-${currentArch().toUpperCase()}-${await hashFiles("pesde.toml", "pesde.lock")}`;
}
