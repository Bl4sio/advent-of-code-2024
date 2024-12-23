interface Pos {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  distance: number;
}

interface Garden {
  type: string;
  nodes: Pos[];
  area: number;
  perimeter: number;
}

function parseInput(inputString: string) {
  return inputString.split("\r\n").map((row) => row.split(""));
}

function getKey(pos: Pos): string {
  return `${pos.x}|${pos.y}`;
}

function getUnvisited(grid: string[][]): Set<string> {
  const unvisited = new Set<string>();
  grid.forEach((row, y) =>
    row.forEach((_, x) => {
      unvisited.add(getKey({ x, y }));
    })
  );
  return unvisited;
}

function isValid({ x, y }: Pos, dim: Pos) {
  return 0 <= x && x < dim.x && 0 <= y && y < dim.y;
}

function addToNodeStack(nodeStack: Node[], x: number, y: number, start: Pos) {
  nodeStack.push({ x, y, distance: Math.abs(x - start.x) + Math.abs(y - start.y) });
}

function discoverGarden(grid: string[][], unvisited: Set<string>, start: string): Garden {
  const dim = { x: grid[0].length, y: grid.length };
  const [x, y] = start.split("|").map((i) => parseInt(i));
  const gardenType = grid[y][x];

  const garden = {
    type: gardenType,
    nodes: [],
    area: 0,
    perimeter: 0,
  };
  const nodeStack: Node[] = [{ x, y, distance: 0 }];

  while (nodeStack.length > 0) {
    const node = nodeStack.pop();
    if (!isValid(node, dim)) {
      garden.perimeter++;
      continue;
    }

    if (gardenType !== grid[node.y][node.x]) {
      garden.perimeter++;
      continue;
    }

    const key = getKey(node);
    if (!unvisited.has(key)) continue;
    unvisited.delete(key);

    garden.nodes.push(node);
    garden.area++;
    addToNodeStack(nodeStack, node.x - 1, node.y, { x, y });
    addToNodeStack(nodeStack, node.x + 1, node.y, { x, y });
    addToNodeStack(nodeStack, node.x, node.y - 1, { x, y });
    addToNodeStack(nodeStack, node.x, node.y + 1, { x, y });
    nodeStack.sort((a, b) => b.distance - a.distance);
  }

  return garden;
}

function discoverGardens(grid: string[][]): Garden[] {
  const unvisited = getUnvisited(grid);
  const gardens = [];

  while (unvisited.size > 0) {
    const iterator = unvisited.values();
    const startNode = iterator.next().value;

    const garden = discoverGarden(grid, unvisited, startNode);
    gardens.push(garden);
  }

  return gardens;
}

function first(inputString: string) {
  const grid = parseInput(inputString);
  const gardens = discoverGardens(grid);
  const sum = gardens.reduce((sum, garden) => sum + garden.area * garden.perimeter, 0);
  console.log(sum === 1573474 ? "SUCCESS!" : "ERROR!");
  return sum;
}

function getRowEdge(coords: number[]): number[] {
  let prev;
  const edges = [];
  coords.forEach((next) => {
    if (prev === undefined) edges.push(next);
    if (next - prev > 1) {
      edges.push(prev + 0.5);
      edges.push(next);
    }
    prev = next;
  });
  edges.push(prev + 0.5);
  return edges;
}

function getAllEdge(nodes: Pos[]): number {
  const rows = new Map<number, Pos[]>();
  const cols = new Map<number, Pos[]>();
  nodes.forEach((node) => {
    const row = rows.get(node.y) ?? [];
    row.push(node);
    rows.set(node.y, row);

    const col = cols.get(node.x) ?? [];
    col.push(node);
    cols.set(node.x, col);
  });

  let edges = 0;
  let lastEdges = [];
  [...rows.values()]
    .sort((a, b) => a[0].y - b[0].y)
    .forEach((row) => {
      const xCoords = row.sort((a, b) => a.x - b.x).map((node) => node.x);
      const nextEdges = getRowEdge(xCoords);
      const newEdges = nextEdges.filter(
        (nextEdge) => undefined === lastEdges.find((lastEdge) => lastEdge === nextEdge)
      );
      edges += newEdges.length;
      lastEdges = nextEdges;
    });

  lastEdges = [];
  [...cols.values()]
    .sort((a, b) => a[0].x - b[0].x)
    .forEach((row) => {
      const xCoords = row.sort((a, b) => a.y - b.y).map((node) => node.y);
      const nextEdges = getRowEdge(xCoords);
      const newEdges = nextEdges.filter(
        (nextEdge) => undefined === lastEdges.find((lastEdge) => lastEdge === nextEdge)
      );
      edges += newEdges.length;
      lastEdges = nextEdges;
    });

  return edges;
}

function second(inputString: string) {
  const grid = parseInput(inputString);
  const gardens = discoverGardens(grid);

  const gardenWithEdges = gardens.map((garden) => {
    return {
      ...garden,
      edges: getAllEdge(garden.nodes),
    };
  });

  return gardenWithEdges.reduce((sum, garden) => sum + garden.area * garden.edges, 0);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
