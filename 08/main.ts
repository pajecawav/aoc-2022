import { readInput } from "../utils";

function part1(text: string) {
	const lines = text.split("\n");

	const result = new Set<string>();

	const size = lines.length;

	const check = (x: number, y: number) => {
		const value = +lines[y][x];
		if (value > tallest) {
			result.add(`${x}.${y}`);
		}
		tallest = Math.max(tallest, value);
	};

	let tallest = -1;
	for (let y = 0; y < size; y++) {
		tallest = -1;
		for (let x = 0; x < size; x++) {
			check(x, y);
		}

		tallest = -1;
		for (let x = size - 1; x >= 0; x--) {
			check(x, y);
		}
	}

	for (let x = 0; x < size; x++) {
		tallest = -1;
		for (let y = 0; y < size; y++) {
			check(x, y);
		}

		tallest = -1;
		for (let y = size - 1; y >= 0; y--) {
			check(x, y);
		}
	}

	return result.size;
}

function part2(text: string) {
	const lines = text.split("\n");
	const size = lines.length;

	let best = -1;

	function search(x: number, y: number): number {
		let total = 1;
		const v = +lines[y][x];

		// prettier-ignore
		for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            let cx = x + dx;
            let cy = y + dy;
            let local = 0;

            while (0 <= cx && cx < size && 0 <= cy && cy < size) {
                const value = +lines[cy][cx];

                if (value >= v) {
                    local++;
                    break;
                }

                local++;
                cx += dx;
                cy += dy;
            }

            total *= local;
        }

		return total;
	}

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const value = search(x, y);
			best = Math.max(best, value);
		}
	}

	return best;
}

const text = readInput();

console.log(part1(text), 1796);
console.log(part2(text), 288120);
