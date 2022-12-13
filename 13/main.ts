import { readInput } from "../utils";

type Item = number | Item[];

function parseLine(line: string): Item[] {
	return JSON.parse(line) as Item[];
}

function parsePair(text: string) {
	const [a, b] = text.split("\n");
	return [a, b].map(parseLine);
}

function compareNums(a: number, b: number): boolean | null {
	if (a < b) return true;
	if (a > b) return false;
	return null;
}

function compare(a: Item, b: Item): boolean | null {
	const isNumA = typeof a === "number";
	const isNumB = typeof b === "number";

	if (isNumA && isNumB) {
		return compareNums(a, b);
	}

	const aArr = isNumA ? [a] : a;
	const bArr = isNumB ? [b] : b;

	const minLength = Math.min(aArr.length, bArr.length);

	for (let i = 0; i < minLength; i++) {
		const cmp = compare(aArr[i], bArr[i]);
		if (cmp !== null) {
			return cmp;
		}
	}

	return compareNums(aArr.length, bArr.length);
}

function part1(text: string) {
	let total = 0;

	const pairs = text.split("\n\n");

	for (let index = 0; index < pairs.length; index++) {
		const pair = pairs[index];
		const [a, b] = parsePair(pair);

		const result = compare(a, b);
		if (result === null) {
			throw new Error("GOT NULL");
		} else if (result) {
			total += index + 1;
		}
	}

	return total;
}

function part2(text: string) {
	text += "\n[[2]]\n[[6]]";
	text = text.replace(/\n\n/g, "\n");

	const packets = text.split("\n").map(parseLine);
	const length = packets.length;

	const indexes = Array.from({ length }, (_, i) => i);

	indexes.sort((i, j) => {
		const cmp = compare(packets[i], packets[j]);
		if (cmp === null) throw new Error("GOT NULL");
		return cmp ? -1 : 1;
	});

	const i = indexes.findIndex(v => v === length - 1);
	const j = indexes.findIndex(v => v === length - 2);

	return (i + 1) * (j + 1);
}

const text = readInput();

console.log(part1(text), 5555);
console.log(part2(text), 22852);
