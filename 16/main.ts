import { readInput, timeit } from "../utils";

interface Node {
	name: string;
	rate: number;
	edges: string[];
}

type Graph = Record<string, Node>;

function parseLine(line: string): Node {
	const parts = line.split(" ");

	const name = parts[1];
	const rate = Number(parts[4].slice(5, -1));
	const edges = parts.slice(9).map(edge => edge.slice(0, 2));

	return { name, rate, edges };
}

function parseText(text: string) {
	const lines = text.split("\n");

	const graph: Graph = {};
	let maxRate = -1;
	let maxTotalRate = 0;
	let goodNodesCount = 0;

	for (const line of lines) {
		const node = parseLine(line);
		graph[node.name] = node;
		maxRate = Math.max(maxRate, node.rate);
		maxTotalRate += node.rate;
		goodNodesCount += Number(node.rate > 0);
	}

	for (const node of Object.values(graph)) {
		node.edges.sort((a, b) => graph[b].rate - graph[a].rate);
	}

	return { graph, maxRate, maxTotalRate, goodNodesCount };
}

function printDotGraph(graph: Graph) {
	console.log("digraph G {");
	for (const node of Object.values(graph)) {
		if (node.rate === 0) {
			console.log(`\t${node.name} [style=filled, fillcolor="red"]`);
		}
	}
	for (const node of Object.values(graph)) {
		for (const edge of node.edges) {
			console.log(`\t${node.name} -> ${edge}`);
		}
	}
	console.log("}");
}

function hashAll(...values: any[]) {
	return values.join("...");
}

function part1(text: string) {
	const { graph, maxTotalRate, goodNodesCount } = parseText(text);

	// return printDotGraph(graph);

	const LIMIT = 30;

	let best = -1;

	const maxPredictions: Record<string, number> = {};

	function dfs(
		minutes: number,
		node: string,
		open: Set<string>,
		currentRate: number,
		total: number,
		prev: string | null
	) {
		total += currentRate;

		const timeLeft = LIMIT - minutes;

		// time expired
		if (timeLeft === 0) {
			best = Math.max(best, total);
			return;
		}

		// all cranes are open
		if (goodNodesCount === open.size) {
			best = Math.max(best, total + timeLeft * currentRate);
			return;
		}

		const hash = hashAll(minutes, node);

		const maxPrediction = total + timeLeft * maxTotalRate;
		const bestMaxPrediction = maxPredictions[hash] ?? -1;
		if (bestMaxPrediction >= maxPrediction || maxPrediction <= best) {
			return;
		}
		maxPredictions[hash] = maxPrediction;

		// not enough time to beat best with all cranes open
		if (maxPrediction <= best) {
			return;
		}

		if (!open.has(node) && graph[node].rate > 0) {
			open.add(node);
			dfs(minutes + 1, node, open, currentRate + graph[node].rate, total, node);
			open.delete(node);
		}

		for (const edge of graph[node].edges) {
			if (edge !== prev) {
				dfs(minutes + 1, edge, open, currentRate, total, node);
			}
		}
	}

	dfs(1, "AA", new Set(), 0, 0, null);

	return best;
}

function part2(text: string) {
	const { graph, maxTotalRate, goodNodesCount } = parseText(text);

	// return printDotGraph(graph);

	const LIMIT = 26;

	let best = -1;

	const maxPredictions: Record<string, number> = {};

	function dfs(
		minutes: number,
		me: string,
		elephant: string,
		open: Set<string>,
		currentRate: number,
		total: number,
		prevMe: string | null,
		prevElephant: string | null
	) {
		total += currentRate;

		const timeLeft = LIMIT - minutes;

		// time expired
		if (timeLeft === 0) {
			best = Math.max(best, total);
			return;
		}

		// all cranes are open
		if (goodNodesCount === open.size) {
			best = Math.max(best, total + timeLeft * currentRate);
			return;
		}

		const hash = hashAll(minutes, me, elephant);

		const maxPrediction = total + timeLeft * maxTotalRate;
		const bestMaxPrediction = maxPredictions[hash] ?? -1;
		if (bestMaxPrediction >= maxPrediction || maxPrediction <= best) {
			return;
		}
		maxPredictions[hash] = maxPrediction;

		// not enough time to beat best with all cranes open
		if (maxPrediction <= best) {
			return;
		}

		function* iterSteps(name: string, prev: string | null) {
			if (!open.has(name) && graph[name].rate > 0) {
				open.add(name);
				currentRate += graph[name].rate;
				yield name;
				currentRate -= graph[name].rate;
				open.delete(name);
			}

			for (const edge of graph[name].edges) {
				if (edge !== prev) {
					yield edge;
				}
			}
		}

		for (const nextMe of iterSteps(me, prevMe)) {
			for (const nextElephant of iterSteps(elephant, prevElephant)) {
				dfs(minutes + 1, nextMe, nextElephant, open, currentRate, total, me, elephant);
			}
		}
	}

	dfs(1, "AA", "AA", new Set(), 0, 0, null, null);

	return best;
}

const text = readInput();

timeit(() => console.log(part1(text), 2029));
timeit(() => console.log(part2(text), 2723));
