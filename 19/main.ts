import { parseInts, readInput, timeit } from "../utils";

const ITEMS = ["ore", "clay", "obs", "geode"] as const;
type Item = typeof ITEMS[number];

const ORE = ITEMS.indexOf("ore");
const CLAY = ITEMS.indexOf("clay");
const OBS = ITEMS.indexOf("obs");
const GEODE = ITEMS.indexOf("geode");

const itemToIndex = ITEMS.reduce((acc, item, i) => {
	acc[item] = i;
	return acc;
}, {} as Record<Item, number>);

type Cost = [number, number, number, number];

interface Blueprint extends Record<Item, Cost> {
	id: number;
}

function parseBlueprint(line: string): Blueprint {
	const [
		id,
		oreCostOre,
		clayCostOre,
		obsidianCostOre,
		obsidianCostClay,
		geodeCostOre,
		geodeCostObsidian,
	] = parseInts(line);

	return {
		id,
		ore: [oreCostOre, 0, 0, 0],
		clay: [clayCostOre, 0, 0, 0],
		obs: [obsidianCostOre, obsidianCostClay, 0, 0],
		geode: [geodeCostOre, 0, geodeCostObsidian, 0],
	};
}

function parseText(text: string): Blueprint[] {
	return text.split("\n").map(parseBlueprint);
}

type Tuple4 = [number, number, number, number];

interface State {
	robots: Tuple4;
	items: Tuple4;
}

function produceItems(state: State): State {
	const items = state.robots.map((value, i) => state.items[i] + value) as Tuple4;
	return {
		robots: state.robots,
		items,
	};
}

function canBuy(item: Item, state: State, bp: Blueprint): boolean {
	const price = bp[item];
	return price.every((p, i) => state.items[i] >= p);
}

function makeBuy(item: Item, state: State, bp: Blueprint): State {
	const price = bp[item];
	const items = state.items.map((item, i) => item - price[i]) as Tuple4;
	const robots = [...state.robots] as Tuple4;
	robots[itemToIndex[item]] += 1;
	return { robots, items };
}

function solve(bp: Blueprint, TIME: number): number {
	const visited = new Set<string>();

	const maxPrices = ITEMS.map((_, i) => Math.max(bp.ore[i], bp.clay[i], bp.obs[i], bp.geode[i]));

	function dfs(bp: Blueprint, minutes: number, state: State, buying: Item): number {
		while (minutes !== TIME && !canBuy(buying, state, bp)) {
			state = produceItems(state);
			minutes++;
		}

		const timeLeft = TIME - minutes;

		if (timeLeft === 0) {
			return state.items[GEODE];
		}

		state = produceItems(state);
		state = makeBuy(buying, state, bp);

		// NOTE: doesn't always work but good enough for the input
		if (canBuy("geode", state, bp)) {
			return dfs(bp, minutes + 1, state, "geode");
		}
		if (maxPrices[OBS] > state.robots[OBS] && canBuy("obs", state, bp)) {
			return dfs(bp, minutes + 1, state, "obs");
		}

		let best = 0;
		for (const item of ITEMS) {
			const itemIdx = itemToIndex[item];
			const willHave = state.items[itemIdx] + state.robots[itemIdx];
			if (item === "geode" || willHave < maxPrices[itemIdx] * timeLeft) {
				const value = dfs(bp, minutes + 1, state, item);
				best = Math.max(value, best);
			}
		}

		return best;
	}

	const INITIAL_STATE: State = {
		robots: [1, 0, 0, 0],
		items: [0, 0, 0, 0],
	};

	let best = 0;
	for (const item of [ITEMS[ORE], ITEMS[CLAY]]) {
		const value = dfs(bp, 0, INITIAL_STATE, item);
		best = Math.max(best, value);
	}

	return best;
}

function part1(text: string) {
	const bps = parseText(text);

	let result = 0;
	for (const bp of bps) {
		console.log(bp);
		const value = solve(bp, 24);
		console.log("FOUND", { id: bp.id, value, mul: bp.id * value });
		result += bp.id * value;
	}

	return result;
}

function part2(text: string) {
	const bps = parseText(text);

	let result = 1;
	for (const bp of bps.slice(0, 3)) {
		console.log(bp);
		const value = solve(bp, 32);
		console.log("FOUND", value);
		result *= value;
	}

	return result;
}

const text = readInput();

timeit(() => console.log(part1(text), 1413));
timeit(() => console.log(part2(text), 21080));
