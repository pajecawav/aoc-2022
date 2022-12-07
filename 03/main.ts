import { readInput, setUnion } from "../utils";

function getPriority(item: string) {
	if (item.toLowerCase() === item) {
		return item.charCodeAt(0) - "a".charCodeAt(0) + 1;
	} else {
		return item.charCodeAt(0) + 26 - "A".charCodeAt(0) + 1;
	}
}

function part1(text: string) {
	const lines = text.split("\n");

	let result = 0;

	for (const line of lines) {
		const a = new Set(line.slice(0, line.length / 2));
		const b = new Set(line.slice(line.length / 2));

		const items = setUnion(a, b);

		for (const item of items) {
			result += getPriority(item);
		}
	}

	return result;
}

function part2(text: string) {
	const lines = text.trim().split("\n");

	let result = 0;

	for (let i = 0; i < lines.length / 3; i++) {
		const a = lines[i * 3];
		const b = lines[i * 3 + 1];
		const c = lines[i * 3 + 2];

		const union = new Set(setUnion(new Set(a), new Set(b)));
		const items = setUnion(new Set(union), new Set(c));

		result += getPriority(items[0]);
	}

	return result;
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
