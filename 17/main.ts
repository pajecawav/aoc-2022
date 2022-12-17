import { clamp, readInput, timeit } from "../utils";

interface Point {
	x: number;
	y: number;
}

type Shape = { points: Point[]; width: number; height: number; yOffsets: Record<number, number> };

const SHAPES_STR = `\
####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;

const SHAPES: Shape[] = SHAPES_STR.split("\n\n").map(shapeStr => {
	const lines = shapeStr.split("\n");

	const height = lines.length;
	const width = lines[0].length;
	const shape: Shape = { points: [], width, height, yOffsets: {} };

	for (let y = 0; y < height; y++) {
		const line = lines[y];
		for (let x = 0; x < width; x++) {
			if (line[x] === "#") {
				shape.points.push({ x, y: y - height + 1 });
				shape.yOffsets[x] = Math.max(shape.yOffsets[x] ?? -999, y - height + 1);
			}
		}
	}

	return shape;
});

function hashPoint(p: Point) {
	return `${p.x}.${p.y}`;
}

const WIDTH = 7;
const START_X = 2;
const Y_OFFSET = 3;

function printTaken(taken: Set<string>, maxY: number) {
	for (let y = maxY; y >= 0; y--) {
		let line = "";
		for (let x = 0; x < WIDTH; x++) {
			line += taken.has(hashPoint({ x, y })) ? "#" : ".";
		}
		console.log(line);
	}
}

function part1(text: string) {
	const taken = new Set<string>();

	let instructionIndex = 0;
	let maxY = 0;
	let offsetX = START_X;
	let offsetY = maxY + Y_OFFSET;
	let rocksCount = 0;
	let shape = SHAPES[rocksCount];

	while (rocksCount < 2022) {
		const dir = text[instructionIndex];
		const dx = dir === ">" ? 1 : -1;
		instructionIndex = (instructionIndex + 1) % text.length;
		const newOffsetX = clamp(offsetX + dx, 0, WIDTH - shape.width);

		if (newOffsetX !== offsetX) {
			// figure out if moving horizontally is allowed
			let canMoveHorizontally = true;
			for (const point of shape.points) {
				const x = newOffsetX + point.x;
				const y = offsetY - point.y;

				if (taken.has(hashPoint({ x, y }))) {
					canMoveHorizontally = false;
					break;
				}
			}

			// move horizontally if we can
			if (canMoveHorizontally) {
				offsetX = newOffsetX;
			}
		}

		// figure out if dropping down is allowed
		let canDropDown = offsetY > 0;
		for (let dx = 0; dx < shape.width; dx++) {
			const x = offsetX + dx;
			const y = offsetY - 1 - shape.yOffsets[dx];

			if (taken.has(hashPoint({ x, y }))) {
				canDropDown = false;
				break;
			}
		}

		if (canDropDown) {
			offsetY -= 1;
		} else {
			for (const point of shape.points) {
				const x = offsetX + point.x;
				const y = offsetY - point.y;
				maxY = Math.max(maxY, y);
				taken.add(hashPoint({ x, y }));
			}

			offsetX = START_X;
			offsetY = maxY + Y_OFFSET + 1;
			rocksCount++;
			shape = SHAPES[rocksCount % SHAPES.length];
		}
	}

	// printTaken(taken, maxY);

	return offsetY - Y_OFFSET;
}

// console.dir(SHAPES, { depth: 99 });

const text = readInput();

timeit(() => console.log(part1(text), 3161));
// timeit(() => console.log(part2(text)));
