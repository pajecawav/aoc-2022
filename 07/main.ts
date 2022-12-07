import { readInput, sum } from "../utils";

interface File {
	name: string;
	size: number;
}

interface Node {
	files: File[];
	dirs: string[];
}

const ROOT = "";

function parseLines(lines: string[]) {
	let total = 0;
	const nodes: Record<string, Node> = {};
	let path = [ROOT];

	let i = 0;

	const consumeOutput = () => {
		const output: string[] = [];
		while (i < lines.length && !lines[i].startsWith("$")) {
			output.push(lines[i++]);
		}
		return output;
	};

	while (i < lines.length) {
		const line = lines[i++];
		const [, cmd, arg] = line.split(" ");

		if (cmd === "cd") {
			switch (arg) {
				case "/":
					path = [ROOT];
					break;
				case "..":
					path.pop();
					break;
				default:
					path.push(arg);
			}
		} else if (cmd === "ls") {
			const fullPath = path.join("/");

			if (nodes[fullPath]) {
				continue;
			}

			const node: Node = { files: [], dirs: [] };

			const output = consumeOutput();
			for (const lsLine of output) {
				const [a, b] = lsLine.split(" ");
				if (a === "dir") {
					node.dirs.push(fullPath + `/${b}`);
				} else {
					node.files.push({ name: b, size: +a });
					total += +a;
				}
			}

			nodes[fullPath] = node;
		} else {
			throw new Error(`Unknown command ${cmd}`);
		}
	}

	return { nodes, total };
}

function visitDirs(nodes: Record<string, Node>, cb: (size: number) => void) {
	function dfs(root: string) {
		const node = nodes[root];
		let total = sum(node.files.map(({ size }) => size));
		total += sum(node.dirs.map(dfs));
		cb(total);
		return total;
	}
	dfs(ROOT);
}

function part1(text: string) {
	const { nodes, total } = parseLines(text.split("\n"));

	let result = 0;

	visitDirs(nodes, size => {
		if (size <= 100_000) {
			result += size;
		}
	});

	return result;
}

function part2(text: string) {
	const TOTAL = 70000000;
	const REQUIRED = 30000000;

	const { nodes, total: taken } = parseLines(text.split("\n"));

	let smallest = Infinity;

	visitDirs(nodes, size => {
		if (TOTAL - taken + size >= REQUIRED) {
			smallest = Math.min(smallest, size);
		}
	});

	return smallest;
}

const text = readInput();

console.log(part1(text));
console.log(part2(text));
