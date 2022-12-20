import { readInput, timeit } from "../utils";

function parseText(text: string): number[] {
	return text.split("\n").map(Number);
}

// function part1(text: string) {
// 	const nums = parseText(text);

// 	const length = nums.length;
// 	const indices = Array.from({ length }, (_, i) => i).reduce((acc, i) => {
// 		acc[i] = i;
// 		return acc;
// 	}, {} as Record<number, number>);

// 	// for (let i = 0; i < length; i++) {
// 	// 	const index = indices[i];

// 	// 	const value = nums[index];
// 	// 	const newIndex = (length + index + value + Math.sign(value)) % length;

// 	// 	console.log("Moving:", { i, index, value, newIndex });
// 	// 	console.log("Before:", nums.join());

// 	// 	if (newIndex > index) {
// 	// 		nums.splice(newIndex, 0, value);
// 	// 		nums.splice(index, 1);
// 	// 	} else if (newIndex < index) {
// 	// 		nums.splice(index, 1);
// 	// 		nums.splice(newIndex, 0, value);
// 	// 	}

// 	// 	indices[i] = newIndex;
// 	// 	console.log("After:", nums.join());
// 	// 	console.log(indices);
// 	// 	console.log();
// 	// }

// 	let offset = 0;
// 	for (let i = 0; i < length; i++) {
// 		const index = offset;

// 		const value = nums[index];
// 		const newIndex = (length + index + value + Math.sign(value)) % length;

// 		console.log("Before:", nums.join());
// 		console.log("Moving:", { i, index, value, newIndex, offset });

// 		if (newIndex > index) {
// 			nums.splice(newIndex, 0, value);
// 			nums.splice(index, 1);

// 			// offset--;
// 		} else if (newIndex < index) {
// 			nums.splice(index, 1);
// 			nums.splice(newIndex, 0, value);

// 			offset++;
// 		} else {
// 			offset++;
// 		}

// 		console.log("After:", nums.join());
// 		console.log();
// 	}

// 	const get = (index: number) => nums[index % length];

// 	return get(1000) * get(2000) * get(3000);
// }

interface Node {
	value: number;
	next: Node;
	prev: Node;
}

function printList(head: Node) {
	const values: number[] = [];
	let node = head;
	do {
		values.push(node.value);
		node = node.next;
	} while (node !== head);
	console.log(values.join());
}

function part1(text: string) {
	const nums = parseText(text);

	const length = nums.length;
	const nodes = nums.map(value => ({ value } as Node));

	for (let i = 0; i < length; i++) {
		const node = nodes[i];
		node.next = nodes[(i + 1) % length];
		node.prev = nodes[(i - 1 + length) % length];
	}

	for (let i = 0; i < length; i++) {
		const node = nodes[i];
		let count = node.value;

		count = count % (length - 1);
		if (count < 0) {
			count += length - 1;
		}

		if (count === 0) {
			continue;
		}

		let other = node;
		while (count-- > 0) {
			other = other.next;
		}

		const left = node.prev;
		const right = node.next;

		const otherLeft = other.prev;
		const otherRight = other.next;

		left.next = right;
		right.prev = left;

		other.next = node;
		otherRight.prev = node;

		node.prev = other;
		node.next = otherRight;
	}

	let node = nodes.find(node => node.value === 0)!;
	let result = 0;
	for (let i = 1; i <= 3000; i++) {
		node = node.next;
		if (i % 1000 === 0) {
			result += node.value;
		}
	}

	return result;
}

function part2(text: string) {
	const nums = parseText(text);

	const length = nums.length;
	const nodes = nums.map(value => ({ value: value * 811589153 } as Node));

	for (let i = 0; i < length; i++) {
		const node = nodes[i];
		node.next = nodes[(i + 1) % length];
		node.prev = nodes[(i - 1 + length) % length];
	}

	let N = 10;
	while (N--) {
		for (let i = 0; i < length; i++) {
			const node = nodes[i];
			let count = node.value;

			count = count % (length - 1);
			if (count < 0) {
				count += length - 1;
			}

			if (count === 0) {
				continue;
			}

			let other = node;
			while (count-- > 0) {
				other = other.next;
			}

			const left = node.prev;
			const right = node.next;

			const otherLeft = other.prev;
			const otherRight = other.next;

			left.next = right;
			right.prev = left;

			other.next = node;
			otherRight.prev = node;

			node.prev = other;
			node.next = otherRight;
		}
	}

	let node = nodes.find(node => node.value === 0)!;
	let result = 0;
	for (let i = 1; i <= 3000; i++) {
		node = node.next;
		if (i % 1000 === 0) {
			result += node.value;
		}
	}

	return result;
}

const text = readInput();

timeit(() => console.log(part1(text), 7713));
timeit(() => console.log(part2(text), 1664569352803));
