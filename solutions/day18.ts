// const DIM_X = 7;
// const DIM_Y = 7;
// const BYTE_LIMIT = 12;

const DIM_X = 71;
const DIM_Y = 71;
const BYTE_LIMIT = 1024;

interface Pos {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  dist: number;
  path: Pos[];
}

interface Grid {
  dist: number;
  blocked: boolean;
}

function parseInput(inputString: string): Pos[] {
  const blocks = [];
  inputString.split("\r\n").map((row) => {
    const [x, y] = row.split(",").map((x) => parseInt(x));
    blocks.push({ x, y });
  });
  return blocks;
}

function getGrid(blocks: Pos[], byteLimit: number): Grid[][] {
  const grid: Grid[][] = new Array(DIM_Y).fill(0).map((_) =>
    new Array(DIM_X).fill(0).map((_) => ({
      dist: Infinity,
      blocked: false,
    }))
  );

  blocks.slice(0, byteLimit).forEach((block) => {
    grid[block.y][block.x].blocked = true;
  });

  return grid;
}

function isEnd({ x, y }: Pos): boolean {
  return x === DIM_X - 1 && y === DIM_Y - 1;
}

function isValid(x: number, y: number): boolean {
  return 0 <= x && x < DIM_X && 0 <= y && y < DIM_Y;
}

function getNeighBour(pos: Node, dx: number, dy: number): Node | undefined {
  const x = pos.x + dx;
  const y = pos.y + dy;

  if (!isValid(x, y)) return undefined;

  const nextNode: Node = {
    x,
    y,
    dist: pos.dist + 1,
    // path: [],
    path: [...pos.path, { x: pos.x + dx, y: pos.y + dy }],
  };
  return nextNode;
}

function getNeighBours(node: Node, grid: Grid[][]): Node[] {
  return [
    getNeighBour(node, -1, 0),
    getNeighBour(node, 1, 0),
    getNeighBour(node, 0, -1),
    getNeighBour(node, 0, 1),
  ].filter((node) => {
    if (!node) return false;
    const gridPos = grid[node.y][node.x];
    if (gridPos.blocked) return false;
    if (gridPos.dist <= node.dist) return false;
    return true;
  });
}

function findPath(grid: Grid[][]): Node {
  const start: Node = { x: 0, y: 0, dist: 0, path: [] };

  const stack = [start];

  while (stack.length > 0) {
    const current = stack.pop();
    const gridPos = grid[current.y][current.x];
    if (gridPos.dist <= current.dist) continue;
    gridPos.dist = current.dist;

    if (isEnd(current)) return current;

    const neighBours = getNeighBours(current, grid);
    stack.push(...neighBours);
    stack.sort((a, b) => b.dist - a.dist);
  }
  return undefined;
}

function print(grid: Grid[][]) {
  grid.forEach((row) =>
    console.log(row.map((point) => (point.blocked ? "#" : point.dist === Infinity ? " " : ".")).join(""))
  );
}

function first(inputString: string) {
  const blocks = parseInput(inputString);
  const grid = getGrid(blocks, BYTE_LIMIT);
  const endNode = findPath(grid);

  if (!endNode) return -1;
  return endNode.dist;
}

function second(inputString: string) {
  const blocks = parseInput(inputString);

  let min = BYTE_LIMIT;
  let max = blocks.length;

  while (max - min > 1) {
    const next = Math.ceil((max + min) / 2);
    const grid = getGrid(blocks, next);
    const endNode = findPath(grid);
    if (!endNode) max = next;
    else min = next;
  }

  return `${blocks[max - 1].x},${blocks[max - 1].y}`;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
