import { Counter, readInput, timeit } from "../utils";

type Sign = "*" | "+";

type Operation = [Sign, number];

interface Monkey {
	items: number[];
	// operation: Operation;
	operation: string;
	divisor: number;
	ifTrue: number;
	ifFalse: number;
}

// function parseOperation(text: string): Operation {
// 	const [op, num] = text.split(" ");
// 	return [op as Sign, +num];
// }

// function applyOperation(num: number, operation: Operation): number {
// 	const [op, other] = operation;
// 	switch (op) {
// 		case "+":
// 			return num + other;
// 		case "*":
// 			return num * other;
// 		default:
// 			throw new Error(`Unknown operation ${op}`);
// 	}
// }

function parseOperation(text: string): string {
	return text.replace("new", "value");
}

function applyOperation(old: number, operation: string): number {
	let value = 0;
	eval(operation);
	return value;
}

function parseMonkeyText(text: string): Monkey {
	const lines = text.split("\n").map(line => line.trim());

	const items = lines[1].split(": ")[1].split(", ").map(Number);
	// const operation = parseOperation(lines[2].split(" old ")[1]);
	const operation = parseOperation(lines[2].split("Operation: ")[1]);
	const divisor = +lines[3].split(" by ")[1];
	const ifTrue = +lines[4].split(" monkey ")[1];
	const ifFalse = +lines[5].split(" monkey ")[1];

	return { items, operation, divisor, ifTrue, ifFalse };
}

function part1(text: string) {
	const monkeys = text.split("\n\n").map(parseMonkeyText);

	const inspections = new Counter();

	for (let cycle = 0; cycle < 20; cycle++) {
		for (let i = 0; i < monkeys.length; i++) {
			const monkey = monkeys[i];

			for (const item of monkey.items) {
				const worry = Math.floor(applyOperation(item, monkey.operation) / 3);
				const targetMonkey = worry % monkey.divisor === 0 ? monkey.ifTrue : monkey.ifFalse;
				monkeys[targetMonkey].items.push(worry);
			}

			inspections.inc(i, monkey.items.length);
			monkey.items = [];
		}
	}

	const [a, b] = [...inspections.values()].sort((a, b) => b - a);

	return a * b;
}

function part2(text: string) {
	const monkeys = text.split("\n\n").map(parseMonkeyText);

	const inspections = new Counter();

	const mod = monkeys.map(m => m.divisor).reduce((m, v) => m * v, 1);

	for (let cycle = 0; cycle < 10_000; cycle++) {
		for (let i = 0; i < monkeys.length; i++) {
			const monkey = monkeys[i];

			for (const item of monkey.items) {
				const worry = applyOperation(item, monkey.operation) % mod;
				const targetMonkey = worry % monkey.divisor === 0 ? monkey.ifTrue : monkey.ifFalse;
				monkeys[targetMonkey].items.push(worry);
			}

			inspections.inc(i, monkey.items.length);
			monkey.items = [];
		}
	}

	const [a, b] = [...inspections.values()].sort((a, b) => b - a);

	return a * b;
}

const text = readInput();

timeit(() => console.log(part1(text), 58056));
timeit(() => console.log(part2(text), 15048718170));
