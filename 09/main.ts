import { readInput } from "../utils";

const deltas = {
	R: [1, 0],
	L: [-1, 0],
	U: [0, 1],
	D: [0, -1],
};

interface Point {
	x: number;
	y: number;
}

function pointToString(point: Point) {
	return `${point.x}.${point.y}`;
}

function adjust(head: Point, tail: Point) {
	const dx = head.x - tail.x;
	const dy = head.y - tail.y;

	const adx = Math.abs(dx);
	const ady = Math.abs(dy);
	if (Math.max(adx, ady) === 1) {
		// near (do nothing)
		return;
	}

	if (dx === 0) {
		// horizontal
		tail.y += Math.floor(dy / 2);
	} else if (dy === 0) {
		// vertical
		tail.x += Math.floor(dx / 2);
	} else {
		// too far
		tail.x += Math.sign(dx);
		tail.y += Math.sign(dy);
	}
}

function simulate(length: number) {}

function part1(text: string) {
	const head: Point = { x: 0, y: 0 };
	const tail: Point = { x: 0, y: 0 };

	const visited = new Set<string>([pointToString(tail)]);

	for (const line of text.split("\n")) {
		const [dir, length_] = line.split(" ");
		let length = +length_;

		const [mx, my] = deltas[dir];

		while (length--) {
			head.x += mx;
			head.y += my;

			adjust(head, tail);

			visited.add(pointToString(tail));
		}
	}

	return visited.size;
}

function part2(text: string) {
	const knots: Point[] = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));

	const head = knots[0];
	const visited = new Set<string>([pointToString(knots.at(0)!)]);

	for (const line of text.split("\n")) {
		const [dir, length_] = line.split(" ");
		let length = +length_;

		const [mx, my] = deltas[dir];

		while (length--) {
			head.x += mx;
			head.y += my;

			for (let i = 0; i < knots.length - 1; i++) {
				adjust(knots[i], knots[i + 1]);
			}

			visited.add(pointToString(knots.at(-1)!));
		}
	}

	return visited.size;
}

const text = readInput();

console.log(part1(text), 6337);
console.log(part2(text), 2455);
