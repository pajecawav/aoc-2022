import { readFileSync } from "fs";

export function readInput(filename?: string) {
	filename ??= process.argv[2];

	if (!filename) {
		console.error("MISSING FILENAME");
		process.exit(1);
	}

	const text = readFileSync(filename, "utf8");

	return text.trimEnd();
}

export function sum(values: number[]) {
	return values.reduce((acc, v) => acc + v, 0);
}

export function setUnion<T>(a: Set<T>, b: Set<T>): T[] {
	const result: T[] = [];

	for (const item of a) {
		if (b.has(item)) {
			result.push(item);
		}
	}

	return result;
}

export function timeit(fn: () => void) {
	const start = Date.now();
	fn();
	const end = Date.now();
	console.log(`Run in ${(end - start).toFixed(0)}ms`);
}
