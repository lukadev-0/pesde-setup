import log, { isDebug } from "./logging.js";

import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

let logger = log.child({ scope: "github" });

export function redactToken(token?: string): string {
	if (!token) return "<none>";
	const prefix = token.substring(0, 5); // "ghp_abc" or first 7 chars
	return token.replace(new RegExp(token, "g"), `${prefix}***`);
}

export const token = getInput("token") || process.env.GITHUB_TOKEN;
logger.info(`Initalized GitHub client with token: ${redactToken(token)}`);

logger = logger.child({ scope: "github.octokit" });
export const client: ReturnType<typeof getOctokit> = getOctokit(token!, {
	request: {
		// add a fetch hook for debug logging
		fetch: isDebug()
			? async (input: string | URL | Request, init?: RequestInit) => {
					const url = String(input);
					const method = init?.method || "GET";
					logger.debug(`→ ${method} ${url}`);

					const start = performance.now();
					const resp = await fetch(input, init);
					const duration = (performance.now() - start).toFixed(2);
					logger.debug(`← ${resp.status} ${method} ${url} (${duration}μs)`);

					return resp;
				}
			: fetch
	},

	log: {
		debug: logger.debug,
		info: logger.info,
		warn: logger.warn,
		error: logger.error
	}
});
