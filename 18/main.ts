import { readInput, sum } from "../utils";

interface Point {
	x: number;
	y: number;
	z: number;
}

function parseText(text: string): Point[] {
	return text.split("\n").map(line => {
		const [x, y, z] = line.split(",").map(Number);
		return { x, y, z };
	});
}

function getAdjacent(point: Point): Point[] {
	// prettier-ignore
	const deltas = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
	return deltas.map(([dx, dy, dz]) => ({
		x: point.x + dx,
		y: point.y + dy,
		z: point.z + dz,
	}));
}

function hashPoint(point: Point) {
	return [point.x, point.y, point.z].join(",");
}

function part1(text: string) {
	const points = parseText(text);
	const grid: Map<string, Point> = new Map(points.map(point => [hashPoint(point), point]));

	const visited = new Set<string>();

	function dfs(point: Point): number {
		const hash = hashPoint(point);
		if (visited.has(hash)) {
			return 0;
		}
		visited.add(hash);

		let total = 0;

		for (const adj of getAdjacent(point)) {
			const p = grid.get(hashPoint(adj));
			total += p ? dfs(p) : 1;
		}

		return total;
	}

	return sum(points.map(dfs));
}

function part2(text: string) {
	const points = parseText(text);
	const grid: Map<string, Point> = new Map(points.map(point => [hashPoint(point), point]));

	const width = 2 + Math.max(...points.map(point => point.x));
	const height = 2 + Math.max(...points.map(point => point.y));
	const depth = 2 + Math.max(...points.map(point => point.z));

	const queue: Point[] = [{ x: -1, y: -1, z: -1 }];
	const outsides = new Set<string>();
	while (queue.length) {
		const point = queue.pop()!;

		const hash = hashPoint(point);
		outsides.add(hash);

		for (const adj of getAdjacent(point)) {
			const adjHash = hashPoint(adj);
			const fits =
				// prettier-ignore
				(adj.x >= -1 && adj.x < width) &&
				(adj.y >= -1 && adj.y < height) &&
				(adj.z >= -1 && adj.z < depth);
			if (fits && !grid.has(adjHash) && !outsides.has(adjHash)) {
				queue.push(adj);
			}
		}
	}

	let surface = 0;

	for (const point of points) {
		for (const adj of getAdjacent(point)) {
			if (outsides.has(hashPoint(adj))) {
				surface++;
			}
		}
	}

	return surface;
}

const text = readInput();

console.log(part1(text), 4512);
console.log(part2(text), 2554);
