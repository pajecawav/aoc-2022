import invariant from "tiny-invariant";
import { readInput, timeit } from "../utils";

type Operation = "+" | "-" | "/" | "*";

interface Expression {
	op: Operation;
	left: string;
	right: string;
}

type Value = number | Expression;

function parseValue(str: string): Value {
	const parts = str.split(" ");

	if (parts.length === 1) {
		return parseInt(parts[0], 10);
	}

	const exp: Expression = {
		left: parts[0],
		op: parts[1] as Operation,
		right: parts[2],
	};

	return exp;
}

function parseText(text: string): Record<string, Value> {
	const monkeys: Record<string, Value> = {};

	for (const line of text.split("\n")) {
		const [name, value] = line.split(": ");
		monkeys[name] = parseValue(value);
	}

	return monkeys;
}

function applyOperation(left: number, right: number, op: Operation): number {
	switch (op) {
		case "+":
			return left + right;
		case "-":
			return left - right;
		case "*":
			return left * right;
		case "/":
			return left / right;
	}

	throw new Error("UNREACHABLE");
}

function dfs(name: string, monkeys: Record<string, Value>): number {
	const value = monkeys[name];

	if (typeof value === "number") {
		return value;
	}

	const left = dfs(value.left, monkeys);
	const right = dfs(value.right, monkeys);

	return applyOperation(left, right, value.op);
}

function search(name: string, monkeys: Record<string, Value>, goal: number): number {
	const value = monkeys[name];

	if (Number.isNaN(value)) {
		return goal;
	}

	invariant(typeof value !== "number");

	const left = dfs(value.left, monkeys);
	const right = dfs(value.right, monkeys);

	if (Number.isNaN(left)) {
		switch (value.op) {
			case "+":
				return search(value.left, monkeys, goal - right); // left + right = goal
			case "-":
				return search(value.left, monkeys, goal + right); // left - right = goal
			case "*":
				return search(value.left, monkeys, goal / right); // left * right = goal
			case "/":
				return search(value.left, monkeys, goal * right); // left / right = goal
		}
		invariant(false, "UNREACHABLE");
	} else {
		switch (value.op) {
			case "+":
				return search(value.right, monkeys, goal - left); // left + right = goal
			case "-":
				return search(value.right, monkeys, left - goal); // left - right = goal
			case "*":
				return search(value.right, monkeys, goal / left); // left * right = goal
			case "/":
				return search(value.right, monkeys, left / goal); // left / right = goal
		}
		invariant(false, "UNREACHABLE");
	}
}

function part1(text: string) {
	const monkeys = parseText(text);

	const result = dfs("root", monkeys);

	return result;
}

function part2(text: string) {
	const monkeys = parseText(text);

	const root = monkeys["root"] as Expression;

	monkeys["humn"] = NaN;
	root.op = "-";

	const result = search("root", monkeys, 0);

	return result;
}

const text = readInput();

timeit(() => console.log(part1(text), 121868120894282));
timeit(() => console.log(part2(text), 3582317956029));
