import { adjacent4, fits, readInput } from "../utils";

interface Point {
	x: number;
	y: number;
}

function hashPoint(point: Point) {
	return `${point.x}.${point.y}`;
}

function parseText(text: string) {
	const lines = text.split("\n");

	const width = lines[0].length;
	const height = lines.length;
	const grid: number[][] = [];

	let start: Point = { x: -1, y: -1 };
	let end: Point = { x: -1, y: -1 };

	for (let y = 0; y < height; y++) {
		const row: number[] = [];
		for (let x = 0; x < width; x++) {
			let char = lines[y][x];
			if (char === "S") {
				start = { x, y };
				char = "a";
			} else if (char === "E") {
				end = { x, y };
				char = "z";
			}
			row.push(char.charCodeAt(0) - 97);
		}
		grid.push(row);
	}

	return { grid, start, end, width, height };
}

function search(starts: Point[], end: Point, grid: number[][]) {
	const height = grid.length;
	const width = grid[0].length;

	let steps = 0;
	// NOTE: not really a visited but rather wasOrIsInQueue
	const visited = new Set<string>();
	let queue: Point[] = [...starts];

	while (queue.length) {
		const newQueue: Point[] = [];

		for (const point of queue) {
			if (point.x === end.x && point.y === end.y) {
				return steps;
			}

			const value = grid[point.y][point.x];

			for (const [x, y] of adjacent4(point.x, point.y)) {
				if (!fits(x, y, width, height)) {
					continue;
				}

				const p = { x, y };
				const v = grid[y][x];

				if (visited.has(hashPoint(p))) {
					continue;
				}

				if (v - value <= 1) {
					visited.add(hashPoint(p));
					newQueue.push(p);
				}
			}

			// visited.add(hashPoint(point));
		}

		steps++;
		queue = newQueue;
	}

	return -1;
}

function part1(text: string) {
	const { grid, start, end } = parseText(text);
	return search([start], end, grid);
}

function part2(text: string) {
	const { grid, end, width, height } = parseText(text);

	const starts: Point[] = [];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (grid[y][x] === 0) {
				starts.push({ x, y });
			}
		}
	}

	return search(starts, end, grid);
}

const text = readInput();

console.log(part1(text), 534);
console.log(part2(text), 525);
