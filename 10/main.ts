import { readInput } from "../utils";

function part1(text: string) {
	let result = 0;

	let register = 1;
	let tick = 0;

	const work = (ticks: number) => {
		while (ticks--) {
			tick++;

			if ((tick - 20) % 40 === 0) {
				result += tick * register;
			}
		}
	};

	for (const line of text.split("\n")) {
		const [op, value_] = line.split(" ");
		const value = +value_;

		switch (op) {
			case "noop":
				work(1);
				break;
			case "addx":
				work(2);
				register += value;
				break;
			default:
				throw new Error(`Unknown op: ${op}`);
		}
	}

	return result;
}

function part2(text: string) {
	const HEIGHT = 6;
	const WIDTH = 40;

	let register = 1;
	let tick = 0;
	let crtIndex = 0;

	const screen = Array.from({ length: HEIGHT * WIDTH }, () => " ");

	const work = (ticks: number) => {
		while (ticks--) {
			tick++;

			if ([register - 1, register, register + 1].includes(crtIndex % WIDTH)) {
				screen[crtIndex] = "#";
			}

			crtIndex++;
		}
	};

	const lines = text.split("\n");

	let lineIndex = 0;
	while (crtIndex < WIDTH * HEIGHT) {
		const line = lines[lineIndex++ % lines.length];
		const [op, value_] = line.split(" ");
		const value = +value_;

		switch (op) {
			case "noop":
				work(1);
				break;
			case "addx":
				work(2);
				register += value;
				break;
			default:
				throw new Error(`Unknown op: ${op}`);
		}
	}

	const renderedLines: string[] = [];
	for (let i = 0; i < HEIGHT * WIDTH; i += WIDTH) {
		renderedLines.push(screen.slice(i, i + WIDTH).join(""));
	}

	return renderedLines.join("\n");
}

const text = readInput();

console.log(part1(text), 14160);
console.log(part2(text), "\nRJERPEFC");
