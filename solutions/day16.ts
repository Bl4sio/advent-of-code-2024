enum DIR {
  LEFT = 0,
  UP = 1,
  RIGHT = 2,
  DOWN = 3,
}

const dirMoveMapping = {
  [DIR.LEFT]: { x: -1, y: 0 },
  [DIR.RIGHT]: { x: 1, y: 0 },
  [DIR.UP]: { x: 0, y: -1 },
  [DIR.DOWN]: { x: 0, y: 1 },
};

const dirPrintMapping = {
  [DIR.LEFT]: "<",
  [DIR.RIGHT]: ">",
  [DIR.UP]: "^",
  [DIR.DOWN]: "v",
};

interface Pos {
  x: number;
  y: number;
  dir: DIR;
  score: number;
  count: number;
  path: { x: number; y: number; dir: DIR; count: number }[];
}

function rotateLeft(dir: DIR): DIR {
  return (dir + 3) % 4;
}

function rotateRight(dir: DIR): DIR {
  return (dir + 1) % 4;
}

function parseInput(inputString: string): { map: string[]; start: Pos; end: { x: number; y: number } } {
  const map = inputString.split("\r\n");
  const start: Pos = { x: -1, y: -1, dir: DIR.RIGHT, score: 0, path: [], count: 1 };
  const end = { x: -1, y: -1 };
  map.find((row, y) => {
    const x = row.indexOf("S");
    if (x !== -1) {
      start.x = x;
      start.y = y;
      return true;
    }
  });
  map.find((row, y) => {
    const x = row.indexOf("E");
    if (x !== -1) {
      end.x = x;
      end.y = y;
      return true;
    }
  });

  return { map, start, end };
}

function getKey(pos: Pos): string {
  return `${pos.x}|${pos.y}|${pos.dir}`;
}

function getValidMove(map: string[], pos: Pos, scoreInc: number, dir: DIR, delta: { x: number; y: number }) {
  const nextX = pos.x + delta.x;
  const nextY = pos.y + delta.y;
  const nextPos = map[nextY][nextX];
  if (nextPos === "#") return undefined;

  return {
    x: nextX,
    y: nextY,
    dir: dir,
    score: pos.score + scoreInc,
    path: [...pos.path],
    count: pos.count,
  };
}

function checkNeighbours(map: string[], pos: Pos): Pos[] {
  const delta = dirMoveMapping[pos.dir];

  const leftDir = rotateLeft(pos.dir);
  const leftDelta = dirMoveMapping[leftDir];

  const rightDir = rotateRight(pos.dir);
  const rightDelta = dirMoveMapping[rightDir];

  const possibleMoves = [
    getValidMove(map, pos, 1001, leftDir, leftDelta),
    getValidMove(map, pos, 1001, rightDir, rightDelta),
    getValidMove(map, pos, 1, pos.dir, delta),
  ].filter((x) => !!x);

  return possibleMoves;
}

function findShortestPaths(map: string[], start: Pos, end: { x: number; y: number }) {
  const bestPaths: Pos[] = [];

  const moves = [start];
  const visitedPos = new Map<string, number>();
  let nextPos: Pos;

  while ((nextPos = moves.pop())) {
    const key = getKey(nextPos);
    const best = visitedPos.get(key) ?? Infinity;

    if (best < nextPos.score) continue;
    visitedPos.set(key, nextPos.score);

    if (nextPos.x === end.x && nextPos.y === end.y) {
      bestPaths.push(nextPos);
      continue;
    }
    if (bestPaths.length > 0) continue;

    nextPos.path.push({ x: nextPos.x, y: nextPos.y, dir: nextPos.dir, count: nextPos.count });

    const validMoves = checkNeighbours(map, nextPos);
    moves.push(...validMoves);
    moves.sort((x, y) => y.score - x.score);
  }
  return bestPaths;
}

function print(map: string[], pos: Pos) {
  const finalMap = map.map((row) => row.split(""));

  pos.path.forEach((move) => {
    const moveChar = dirPrintMapping[move.dir];
    finalMap[move.y][move.x] = moveChar;
  });

  finalMap.forEach((row) => console.log(row.join("")));
}

function first(inputString: string) {
  const { map, start, end } = parseInput(inputString);
  const shortestPath = findShortestPaths(map, start, end);

  return shortestPath[0].score;
}

function second(inputString: string) {
  const { map, start, end } = parseInput(inputString);
  const shortestPath = findShortestPaths(map, start, end);

  const uniqueFields = new Set();
  shortestPath.forEach((finalPos) => {
    finalPos.path.forEach((step) => {
      uniqueFields.add(`${step.x}|${step.y}`);
    });
  });

  return uniqueFields.size + 1;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
