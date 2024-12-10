interface Node {
  x: number;
  y: number;
  value: number;
}

function parseInput(inputString: string): { map: number[][]; starts: Node[] } {
  const starts = [];
  const map = inputString.split("\r\n").map((row, y) => {
    const parsedRow = [];
    let x = 0;
    for (const c of row) {
      const number = parseInt(c);
      parsedRow.push(number);
      if (number === 0) {
        starts.push({ value: 0, x, y });
      }
      x++;
    }
    return parsedRow;
  });
  return { map, starts };
}

function getKey({ x, y }) {
  return `${x}|${y}`;
}

function isValid(x: number, y: number, dimX: number, dimY: number): boolean {
  return x >= 0 && y >= 0 && x < dimX && y < dimY;
}

function checkNeighbours(map: number[][], pathStack: Node[], nextNode: Node) {
  const { x, y, value } = nextNode;
  checkNeighbour(map, pathStack, x + 1, y, value + 1);
  checkNeighbour(map, pathStack, x - 1, y, value + 1);
  checkNeighbour(map, pathStack, x, y + 1, value + 1);
  checkNeighbour(map, pathStack, x, y - 1, value + 1);
}

function checkNeighbour(map: number[][], pathStack: Node[], x: number, y: number, targetValue: number) {
  const dimX = map[0].length;
  const dimY = map.length;

  if (!isValid(x, y, dimX, dimY)) return;
  const value = map[y][x];
  if (value === targetValue) pathStack.push({ x, y, value });
}

function calculate(inputString: string) {
  const { map, starts } = parseInput(inputString);

  const resultByStarts = starts.map((start) => {
    const ends = new Set<string>();
    let counter = 0;
    const pathStack = [start];
    let nextNode: Node;

    while ((nextNode = pathStack.pop())) {
      if (nextNode.value === 9) {
        counter++;
        ends.add(getKey(nextNode));
        continue;
      }

      checkNeighbours(map, pathStack, nextNode);
    }

    return { ends: ends.size, counter };
  });

  const result = { ends: 0, counter: 0 };
  resultByStarts.forEach((resultByStart) => {
    result.ends += resultByStart.ends;
    result.counter += resultByStart.counter;
  });
  return result;
}

function first(inputString: string) {
  const { ends } = calculate(inputString);
  return ends;
}

function second(inputString: string) {
  const { counter } = calculate(inputString);
  return counter;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
