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

export class Counter<K = any> extends Map<K, number> {
	get(key: K) {
		const value = super.get(key);
		return value ?? 0;
	}

	inc(key: K, value: number = 1) {
		const current = this.get(key);
		const newValue = current + value;
		this.set(key, newValue);
		return newValue;
	}
}

export function fits(x: number, y: number, width: number, height: number) {
	return x >= 0 && x < width && y >= 0 && y < height;
}

export function adjacent4(x: number, y: number) {
	// prettier-ignore
	const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	return deltas.map(([dx, dy]) => [x + dx, y + dy]);
}

export function adjacent8(x: number, y: number) {
	// prettier-ignore
	const deltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	return deltas.map(([dx, dy]) => [x + dx, y + dy]);
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

export function parseInts(text: string): number[] {
	return [...text.matchAll(/-?\d+/g)].map(match => Number(match[0]));
}
