import { readInput } from "../utils";

type Pair<T> = [T, T];

function parseLine(line: string): [Pair<number>, Pair<number>] {
	const [a, b] = line.split(",");
	const first = a.split("-").map(Number) as Pair<number>;
	const second = b.split("-").map(Number) as Pair<number>;
	return [first, second];
}

function part1(text: string) {
	let result = 0;

	for (const line of text.split("\n")) {
		let [first, second] = parseLine(line);
		if (first[0] === second[0]) {
			result += 1;
		} else if (first[0] < second[0]) {
			result += Number(first[1] >= second[1]);
		} else {
			result += Number(second[1] >= first[1]);
		}
	}

	return result;
}

function part2(text: string) {
	let result = 0;

	for (const line of text.split("\n")) {
		let [first, second] = parseLine(line);
		if (first[0] === second[0]) {
			result += 1;
		} else if (first[0] < second[0]) {
			result += Number(first[1] >= second[0]);
		} else {
			result += Number(second[1] >= first[0]);
		}
	}

	return result;
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
