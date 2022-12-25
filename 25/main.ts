import { readInput, sum, timeit } from "../utils";

const DIGITS = "=-012";

function parseNum(num: string) {
	let v = 0;

	for (const digit of num) {
		v *= DIGITS.length;
		v += DIGITS.indexOf(digit) - 2;
	}

	return v;
}

function enbase(num: number) {
	let s = "";

	while (num > 0) {
		num += 2;
		s = DIGITS[num % 5] + s;
		num = Math.floor(num / 5);
	}

	return s;
}

function part1(text: string) {
	const lines = text.split("\n");
	const nums = lines.map(parseNum);

	const total = sum(nums);

	return enbase(total);
}

const text = readInput();

timeit(() => console.log(part1(text), "2=-0=1-0012-=-2=0=01"));
