import { readInput } from "../utils";

function part1(text: string) {
	const games = text.split("\n").filter(Boolean);

	let score = 0;

	for (let game of games) {
		const [a, b] = game.split(" ");

		const opp = "ABC".indexOf(a);
		const me = "XYZ".indexOf(b);

		score += 1 + me;

		if (me === opp) {
			score += 3;
		} else if (me - opp === 1 || (me === 0 && opp === 2)) {
			score += 6;
		}
	}

	return score;
}

function part2(text: string) {
	const games = text.split("\n").filter(Boolean);

	let score = 0;

	for (let game of games) {
		const [a, b] = game.split(" ");

		const opp = "ABC".indexOf(a);
		const me = "XYZ".indexOf(b);

		if (me === 0) {
			//lose
			score += 0 + 1 + ((opp - 1 + 3) % 3);
		} else if (me === 1) {
			// draw
			score += 3 + 1 + opp;
		} else if (me === 2) {
			// win
			score += 6 + 1 + ((opp + 1) % 3);
		}
	}

	return score;
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
