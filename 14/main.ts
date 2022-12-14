import { readInput } from "../utils";

interface Point {
	x: number;
	y: number;
}

interface Line {
	s: Point;
	f: Point;
}

function parseLine(line: string): Point[] {
	return line.split(" -> ").map(str => {
		const [x, y] = str.split(",").map(Number);
		return { x, y };
	});
}

function combinePoints(points: Point[]): Line[] {
	const lines: Line[] = [];
	for (let i = 0; i < points.length - 1; i++) {
		lines.push({ s: points[i], f: points[i + 1] });
	}
	return lines;
}

function hashPoint(p: Point): string {
	return `${p.x}.${p.y}`;
}

function getTakenPoints(lines: Line[]): Set<string> {
	const taken = new Set<string>();

	for (const line of lines) {
		const dx = Math.sign(line.f.x - line.s.x);
		const dy = Math.sign(line.f.y - line.s.y);
		let [x, y] = [line.s.x, line.s.y];
		do {
			taken.add(hashPoint({ x, y }));
			x += dx;
			y += dy;
		} while (x !== line.f.x || y !== line.f.y);
		taken.add(hashPoint({ x, y }));
	}

	return taken;
}

const START = [500, 0];

function part1(text: string) {
	const groups = text.split("\n").map(parseLine);
	const lines = groups.map(combinePoints).flat();

	const taken = getTakenPoints(lines);
	const maxY = Math.max(...groups.flat().map(p => p.y));

	const isFree = (p: Point) => !taken.has(hashPoint(p));

	let [x, y] = START;

	let result = 0;
	outer: while (y < maxY) {
		for (const dx of [0, -1, 1]) {
			if (isFree({ x: x + dx, y: y + 1 })) {
				x += dx;
				y += 1;
				continue outer;
			}
		}

		result++;
		taken.add(hashPoint({ x, y }));
		[x, y] = START;
	}

	return result;
}

function part2(text: string) {
	const groups = text.split("\n").map(parseLine);
	const maxY = Math.max(...groups.flat().map(p => p.y));

	groups.push([
		{ x: -1000, y: maxY + 2 },
		{ x: 1000, y: maxY + 2 },
	]);

	const lines = groups.map(combinePoints).flat();

	const taken = getTakenPoints(lines);

	const isFree = (p: Point) => !taken.has(hashPoint(p));

	let [x, y] = START;

	let result = 0;
	outer: while (true) {
		for (const dx of [0, -1, 1]) {
			if (isFree({ x: x + dx, y: y + 1 })) {
				x += dx;
				y += 1;
				continue outer;
			}
		}

		result++;
		taken.add(hashPoint({ x, y }));
		[x, y] = START;

		if (!isFree({ x, y })) {
			break;
		}
	}

	return result;
}

const text = readInput();

console.log(part1(text), 1003);
console.log(part2(text), 25771);
