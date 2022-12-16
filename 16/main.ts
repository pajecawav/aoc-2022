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
		for (const edge of node.edges) {
			console.log(`\t${node.name} -> ${edge}`);
		}
	}
	console.log("}");
}

function part1(text: string) {
	const { graph, maxTotalRate, goodNodesCount } = parseText(text);

	// return printDotGraph(graph);

	const LIMIT = 30;

	let best = -1;

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

		// not enough time to beat best with all cranes open
		if (total + timeLeft * maxTotalRate <= best) {
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

const text = readInput();

timeit(() => console.log(part1(text), 2029));
// console.log(part2(text));
