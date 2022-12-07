import { readFileSync } from "fs";
import { readInput, sum } from "../utils";

function part1(text: string) {
	const elves = text.split("\n\n");

	let max = -1;

	for (let elve of elves) {
		max = Math.max(max, sum(elve.split("\n").map(Number)));
	}

	return max;
}

function part2(text: string) {
	const elves = text.split("\n\n");

	const calories = elves.map(elve => sum(elve.split("\n").map(Number)));

	calories.sort((a, b) => b - a);

	return sum(calories.slice(0, 3));
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
