import invariant from "tiny-invariant";
import { readInput } from "../utils";

function parseCraneLine(line: string): string[] {
	const chars: string[] = [];

	for (let i = 0; i < line.length; i += 4) {
		chars.push(line[i + 1]);
	}

	return chars;
}

function part1(text: string) {
	const lines = text.split("\n");

	const craneInputIndex = lines.findIndex(line => !line);

	const size = parseCraneLine(lines[0]).length;
	const stacks = Array.from({ length: size }, () => [] as string[]);

	const craneLines = lines.slice(0, craneInputIndex - 1);
	for (const line of craneLines) {
		const chars = parseCraneLine(line);
		chars.forEach((char, i) => {
			if (char !== " ") {
				stacks[i].unshift(char);
			}
		});
	}

	const movementLines = lines.slice(craneInputIndex + 1);
	for (const line of movementLines) {
		const [, count, , fromIndex, , toIndex] = line.split(" ").map(Number);
		for (let i = 0; i < count; i++) {
			const char = stacks[fromIndex - 1].pop();
			invariant(char, "stack was empty");
			stacks[toIndex - 1].push(char);
		}
	}

	const result = stacks.map(stack => stack.at(-1)).join("");

	return result;
}

function part2(text: string) {
	const lines = text.split("\n");

	const craneInputIndex = lines.findIndex(line => !line);

	const size = parseCraneLine(lines[0]).length;
	const stacks = Array.from({ length: size }, () => [] as string[]);

	const craneLines = lines.slice(0, craneInputIndex - 1);
	for (const line of craneLines) {
		const chars = parseCraneLine(line);
		chars.forEach((char, i) => {
			if (char !== " ") {
				stacks[i].unshift(char);
			}
		});
	}

	const movementLines = lines.slice(craneInputIndex + 1);
	for (const line of movementLines) {
		const [, count, , fromIndex, , toIndex] = line.split(" ").map(Number);
		const toMove: string[] = [];
		for (let i = 0; i < count; i++) {
			toMove.unshift(stacks[fromIndex - 1].pop()!);
		}
		stacks[toIndex - 1].push(...toMove);
	}

	const result = stacks.map(stack => stack.at(-1)).join("");

	return result;
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
