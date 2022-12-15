import { readInput } from "../utils";

interface Point {
	x: number;
	y: number;
}

interface Item {
	sensor: Point;
	beacon: Point;
	dist: number;
}

function parseLine(line: string): Item {
	const [x1, y1, x2, y2] = [...line.matchAll(/-?\d+/g)].map(r => Number(r[0]));
	const sensor = { x: x1, y: y1 };
	const beacon = { x: x2, y: y2 };
	const dist = distance(sensor, beacon);
	return { sensor, beacon, dist };
}

function distance(a: Point, b: Point) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function hashPoint(p: Point) {
	return `${p.x}.${p.y}`;
}

function part1(text: string) {
	// TODO: CHANGE THIS
	const IS_INPUT = true;

	const ROW = IS_INPUT ? 2000000 : 10;
	const BOUND = IS_INPUT ? 5e6 : 30;

	const items = text.split("\n").map(parseLine);

	let result = 0;

	for (let x = -BOUND; x < BOUND; x++) {
		const p = { x, y: ROW };

		for (const { sensor, beacon, dist } of items) {
			const curDist = distance(p, sensor);
			if (distance(p, beacon) !== 0 && curDist <= dist) {
				result++;
				break;
			}
		}
	}

	return result;

	// let x = -BOUND - 1;
	// while (++x <= BOUND) {
	// 	const p = { x, y: ROW };

	// 	for (const { sensor, beacon, dist } of items) {
	// 		const curDist = distance(p, sensor);
	// 		if (curDist <= dist) {
	// 			const dx = sensor.x - x;
	// 			const toJump = dx > 0 ? 2 * dx : dist - curDist;
	// 			x += toJump;
	// 			result += 1 + toJump;
	// 			break;
	// 		}
	// 	}
	// }

	// const ignoreBeaconds = new Set<string>();
	// for (const { beacon } of items) {
	// 	if (beacon.y === ROW) {
	// 		ignoreBeaconds.add(hashPoint(beacon));
	// 	}
	// }
	// result -= ignoreBeaconds.size;

	// return result;
}

function part2(text: string) {
	// TODO: CHANGE THIS
	const IS_INPUT = true;

	const UPPER_BOUND = IS_INPUT ? 4000000 : 20;

	const items = text.split("\n").map(parseLine);

	for (let y = 0; y <= UPPER_BOUND; y++) {
		let x = -1;
		outer: while (++x <= UPPER_BOUND) {
			const p = { x, y };

			for (const { sensor, beacon, dist } of items) {
				const curDist = distance(p, sensor);
				if (curDist <= dist) {
					const dx = sensor.x - x;
					x += dx > 0 ? 2 * dx : dist - curDist;
					continue outer;
				}
			}

			return p.x * 4000000 + p.y;
		}
	}

	return "UNREACHABLE";
}

const text = readInput();

console.log(part1(text), 5100463);
console.log(part2(text), 11557863040754);
