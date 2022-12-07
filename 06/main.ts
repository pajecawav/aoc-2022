import { readInput } from "../utils";

// function solve(text: string, length: number) {
// 	const counter: Record<string, number> = {};

// 	for (let i = 0; i < text.length; i++) {
// 		const last = text[i - length];
// 		if (last) {
// 			counter[last] -= 1;
// 			if (!counter[last]) {
// 				delete counter[last];
// 			}
// 		}

// 		const c = text[i];
// 		counter[c] = (counter[c] ?? 0) + 1;

// 		if (Object.keys(counter).length === length) {
// 			return i + 1;
// 		}
// 	}

// 	throw new Error("Unreachable");
// }

function solve(text: string, length: number) {
	let s = "";

	for (let i = 0; i < text.length; i++) {
		if (s.length === length) {
			s = s.slice(1);
		}

		s += text[i];

		if (new Set(s).size === length) {
			return i + 1;
		}
	}

	throw new Error("Unreachable");
}

function part1(text: string) {
	return solve(text, 4);
}

function part2(text: string) {
	return solve(text, 14);
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
