interface Pos {
  x: number;
  y: number;
}

interface Move {
  x: number;
  y: number;
  length: number;
}

function parseInput(inputString: string): { map: string[][]; start: Pos } {
  const map = inputString.split("\r\n").map((row) => row.split(""));
  const start = { x: -1, y: -1 };
  map.find((row, y) =>
    row.find((char, x) => {
      if (char === "S") {
        start.x = x;
        start.y = y;
        map[y][x] = ".";
        return true;
      }
      return false;
    })
  );
  return { map, start };
}

function findPathNew(grid: string[][], start: Pos): { path: Move[]; length: number } {
  const moveStack: Move[] = [{ x: start.x, y: start.y, length: 0 }];
  const visited = new Set<string>();
  const path: Move[] = [];

  while (moveStack.length > 0) {
    const move = moveStack.pop();
    const moveType = grid[move.y][move.x];
    if (moveType === "#") continue;

    const key = getMoveKey(move);
    if (visited.has(key)) continue;
    visited.add(key);

    path.push(move);
    if (moveType === "E") {
      return { path, length: move.length };
    }

    const validMoves = getMoves(move);
    validMoves.forEach((validMove) => moveStack.push(validMove));
  }
}

function getMoves(move: Move): Move[] {
  return [
    getMove(move, { x: -1, y: 0 }),
    getMove(move, { x: 1, y: 0 }),
    getMove(move, { x: 0, y: -1 }),
    getMove(move, { x: 0, y: 1 }),
  ];
}

function getMove(move: Move, delta: Pos): Move {
  return {
    x: move.x + delta.x,
    y: move.y + delta.y,
    length: move.length + 1,
  };
}

function getMoveKey(move: Pos): string {
  return `${move.x}|${move.y}`;
}

function solve(grid: string[][], start: Pos, cheatLimit: number, timeSaveLimit: number): number {
  const { path, length } = findPathNew(grid, start);

  let validCheats = 0;

  const cheatCounts = new Map();

  for (let i = 0; i <= length; i++) {
    for (let j = i + timeSaveLimit; j <= length; j++) {
      const start = path[i];
      const end = path[j];
      const distance = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
      if (distance > cheatLimit) continue;
      const timeSaved = j - i - distance;
      if (timeSaved >= timeSaveLimit) {
        validCheats++;
        const cheatCount = cheatCounts.get(timeSaved) ?? 0;
        cheatCounts.set(timeSaved, cheatCount + 1);
      }
    }
  }

  return validCheats;
}

function first(inputString: string) {
  const { map, start } = parseInput(inputString);
  return solve(map, start, 1, 100);
}

function second(inputString: string) {
  const { map, start } = parseInput(inputString);
  return solve(map, start, 20, 100);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
