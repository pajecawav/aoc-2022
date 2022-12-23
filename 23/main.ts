import invariant from "tiny-invariant";
import { adjacent8, Counter, readInput, timeit } from "../utils";

const enum Dir {
	NORTH,
	SOUTH,
	WEST,
	EAST,
}
const NORTH = Dir.NORTH;
const SOUTH = Dir.SOUTH;
const WEST = Dir.WEST;
const EAST = Dir.EAST;

interface Point {
	x: number;
	y: number;
}

interface Elve {
	next: Point | null;
	dirs: Dir[];
}

type Elves = Record<string, Elve>;

function parseText(text: string): Elves {
	const lines = text.split("\n");

	const height = lines.length;
	const width = lines[0].length;

	const elves: Elves = {};

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (lines[y][x] === "#") {
				elves[hashPoint({ x, y })] = {
					next: null,
					dirs: [NORTH, SOUTH, WEST, EAST],
				};
			}
		}
	}

	return elves;
}

function hashPoint(p: Point) {
	return `${p.x}.${p.y}`;
}

function unhashPoint(s: string): Point {
	const [x, y] = s.split(".").map(Number);
	invariant(!Number.isNaN(x));
	invariant(!Number.isNaN(y));
	return { x, y };
}

// [x, y]
const DELTAS: Record<Dir, [number, number][]> = {
	[Dir.NORTH]: [[-1, -1], [0, -1], [1, -1]], // prettier-ignore
	[Dir.SOUTH]: [[-1, 1], [0, 1], [1, 1]], // prettier-ignore
	[Dir.WEST]: [[-1, -1], [-1, 0], [-1, 1]], // prettier-ignore
	[Dir.EAST]: [[1, -1], [1, 0], [1, 1]], // prettier-ignore
};

function adjacentPoint(point: Point, dir: Dir) {
	const [dx, dy] = DELTAS[dir][1];
	return { x: point.x + dx, y: point.y + dy };
}

function getBoundingRect(elves: Elves): { start: Point; end: Point } {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const posHash of Object.keys(elves)) {
		const pos = unhashPoint(posHash);
		minX = Math.min(minX, pos.x);
		minY = Math.min(minY, pos.y);
		maxX = Math.max(maxX, pos.x);
		maxY = Math.max(maxY, pos.y);
	}

	return {
		start: { x: minX, y: minY },
		end: { x: maxX, y: maxY },
	};
}

function printElves(elves: Elves, size: number) {
	for (let y = -size; y < size; y++) {
		const row = Array.from({ length: size * 2 }, (_, x) => {
			const hash = hashPoint({ x: x - size, y });
			return elves[hash] ? "#" : ".";
		});

		console.log(row.join(""));
	}
}

function rotateDirs(elve: Elve) {
	elve.dirs.push(elve.dirs.shift()!);
}

function step(elves: Elves): Elves {
	const wantToMove = new Counter();

	for (const [posHash, elve] of Object.entries(elves)) {
		const pos = unhashPoint(posHash);

		const adj8 = adjacent8(pos.x, pos.y);
		if (adj8.every(([x, y]) => !elves[hashPoint({ x, y })])) {
			rotateDirs(elve);
			continue;
		}

		for (let dirIndex = 0; dirIndex < elve.dirs.length; dirIndex++) {
			const dir = elve.dirs[dirIndex];

			const deltas = DELTAS[dir];

			if (deltas.some(([dx, dy]) => elves[hashPoint({ x: pos.x + dx, y: pos.y + dy })])) {
				continue;
			}

			const adj = adjacentPoint(pos, dir);
			const adjHash = hashPoint(adj);

			wantToMove.inc(adjHash);
			elve.next = adj;

			break;
		}

		rotateDirs(elve);
	}

	const newElves: Elves = {};

	for (const [posHash, elve] of Object.entries(elves)) {
		const pos = unhashPoint(posHash);
		const next = elve.next;

		if (next === null || wantToMove.get(hashPoint(next)) > 1) {
			newElves[posHash] = elve;
		} else {
			newElves[hashPoint(next)] = elve;
		}

		elve.next = null;
	}

	return newElves;
}

function part1(text: string) {
	let elves = parseText(text);

	for (let i = 0; i < 10; i++) {
		elves = step(elves);
	}

	const rect = getBoundingRect(elves);

	return (
		(1 + rect.end.x - rect.start.x) * (1 + rect.end.y - rect.start.y) -
		Object.keys(elves).length
	);
}

function part2(text: string) {
	let elves = parseText(text);

	let prev = "";
	let i = 0;
	while (true) {
		i++;
		elves = step(elves);
		const cur = Object.keys(elves).join(":");
		if (prev === cur) return i;
		prev = cur;
	}
}

const text = readInput();

timeit(() => console.log(part1(text), 3849));
timeit(() => console.log(part2(text), 995));
