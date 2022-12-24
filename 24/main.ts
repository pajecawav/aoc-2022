import invariant from "tiny-invariant";
import { readInput, timeit } from "../utils";

const enum Dir {
	TOP,
	RIGHT,
	DOWN,
	LEFT,
}

const CHAR_TO_DIR = { "^": Dir.TOP, ">": Dir.RIGHT, v: Dir.DOWN, "<": Dir.LEFT };

interface Point {
	x: number;
	y: number;
}

type Blizzards = Record<string, Dir[]>;

function hashPoint(point: Point) {
	return `${point.x}.${point.y}`;
}

function unhashPoint(s: string): Point {
	const [x, y] = s.split(".").map(Number);
	invariant(!Number.isNaN(x));
	invariant(!Number.isNaN(y));
	return { x, y };
}

function parseText(text: string) {
	const lines = text.split("\n");

	const height = lines.length;
	const width = lines[0].length;

	const start: Point = { x: 1, y: 0 };
	const end: Point = { x: width - 2, y: height - 1 };

	const blizzards: Blizzards = {};
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const char = lines[y][x];
			const dir = CHAR_TO_DIR[char];
			if (dir !== undefined) {
				const hash = hashPoint({ x, y });
				blizzards[hash] ??= [];
				blizzards[hash].push(dir);
			}
		}
	}

	return { blizzards, start, end, width, height };
}

function getNextPos(pos: Point, dir: Dir): Point {
	switch (dir) {
		case Dir.TOP:
			return { x: pos.x, y: pos.y - 1 };
		case Dir.DOWN:
			return { x: pos.x, y: pos.y + 1 };
		case Dir.RIGHT:
			return { x: pos.x + 1, y: pos.y };
		case Dir.LEFT:
			return { x: pos.x - 1, y: pos.y };
	}
}

function moveBlizzards(blizzards: Blizzards, width: number, height: number): Blizzards {
	const newBlizzards: Blizzards = {};

	for (const [hash, dirs] of Object.entries(blizzards)) {
		const point = unhashPoint(hash);

		for (const dir of dirs) {
			const next = getNextPos(point, dir);

			if (next.x === 0) {
				next.x = width - 2;
			}
			if (next.x === width - 1) {
				next.x = 1;
			}
			if (next.y === 0) {
				next.y = height - 2;
			}
			if (next.y === height - 1) {
				next.y = 1;
			}

			const nextHash = hashPoint(next);
			newBlizzards[nextHash] ??= [];
			newBlizzards[nextHash].push(dir);
		}
	}

	return newBlizzards;
}

// prettier-ignore
const DELTAS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
function getAdjacents(point: Point, width: number, height: number): Point[] {
	const adj: Point[] = [];

	for (const [dx, dy] of DELTAS) {
		const x = point.x + dx;
		const y = point.y + dy;
		if (
			(x === 1 && y === 0) || // start
			(x === width - 2 && y === height - 1) || // end
			(x >= 1 && x <= width - 2 && y >= 1 && y <= height - 2)
		) {
			adj.push({ x, y });
		}
	}

	return adj;
}

function solve(
	blizzards: Blizzards,
	start: Point,
	width: number,
	height: number,
	goals: Point[]
): number {
	let positions = new Set<string>([hashPoint(start)]);
	let bzs = blizzards;

	let steps = 0;
	for (; ; steps++) {
		const goal = goals[0];
		const goalHash = hashPoint(goal);

		if (positions.has(goalHash)) {
			goals.shift();
			if (goals.length === 0) {
				break;
			}
			positions = new Set([goalHash]);
		}

		const newPositions = new Set<string>();

		bzs = moveBlizzards(bzs, width, height);

		for (const hash of positions) {
			const pos = unhashPoint(hash);

			const moves = [pos, ...getAdjacents(pos, width, height)];

			for (const move of moves) {
				const moveHash = hashPoint(move);
				const moveBzs = bzs[moveHash] ?? [];
				if (moveBzs.length === 0) {
					newPositions.add(moveHash);
				}
			}
		}

		positions = newPositions;
	}

	return steps;
}

function part1(text: string) {
	const { blizzards, start, end, width, height } = parseText(text);
	return solve(blizzards, start, width, height, [end]);
}

function part2(text: string) {
	const { blizzards, start, end, width, height } = parseText(text);
	return solve(blizzards, start, width, height, [end, start, end]);
}

const text = readInput();

timeit(() => console.log(part1(text), 292));
timeit(() => console.log(part2(text), 816));
