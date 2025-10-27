import type { components } from "@octokit/openapi-types";
export type ReleaseAsset = components["schemas"]["release-asset"];

declare global {
	interface Array<T> {
		filterMap<U>(fn: (item: T) => U | null | undefined): U[];
	}
}

Array.prototype.filterMap = function <T, U>(predicate: (item: T) => U | null | undefined): U[] {
	return this.flatMap((item) => {
		const result = predicate(item);
		return result != null ? [result] : [];
	});
};

export function fallibleToNull<T>(fn: (...args: any[]) => T, ...args: any[]): T | null {
	try {
		return fn(args);
	} catch {
		return null;
	}
}

export default {};
