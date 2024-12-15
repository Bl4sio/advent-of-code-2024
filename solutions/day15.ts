function parseInput(
  inputString: string,
  duplicate: boolean
): { map: string[][]; commands: string[]; robotPos: { x: number; y: number } } {
  let isMap = true;
  const map = [];
  const commands = [];
  const robotPos = { x: 0, y: 0 };

  inputString.split("\r\n").forEach((row) => {
    if (row === "") {
      isMap = false;
      return;
    }
    if (isMap) {
      const duplicatedRow = [
        ...row.replaceAll("#", "##").replaceAll("O", "[]").replaceAll(".", "..").replaceAll("@", "@."),
      ];
      map.push(duplicate ? duplicatedRow : [...row]);
    }

    if (!isMap) {
      commands.push(...row);
    }
  });

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        map[y][x] = ".";
        robotPos.x = x;
        robotPos.y = y;
      }
    }
  }

  return { map, commands, robotPos };
}

const MOVES = {
  "<": { x: -1, y: 0 },
  ">": { x: 1, y: 0 },
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
};

function move(map: string[][], robotPos: { x: number; y: number }, command: string): void {
  const { x: dx, y: dy } = MOVES[command];

  let currX = robotPos.x;
  let currY = robotPos.y;
  let next;
  let boxes = false;
  while (next !== "#") {
    currX += dx;
    currY += dy;
    next = map[currY][currX];
    if (next === "O") {
      boxes = true;
      continue;
    }
    if (next === ".") {
      robotPos.x += dx;
      robotPos.y += dy;
      if (boxes) {
        map[robotPos.y][robotPos.x] = ".";
        map[currY][currX] = "O";
      }
      break;
    }
  }
}

function first(inputString: string) {
  const { map, robotPos, commands } = parseInput(inputString, false);

  commands.forEach((command) => {
    move(map, robotPos, command);
  });

  let sum = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "O") {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
}

function getKey(x: number, y: number): string {
  return `${x}|${y}`;
}

function getCoords(key: string): { x: number; y: number } {
  const [x, y] = key.split("|");
  return { x: parseInt(x), y: parseInt(y) };
}

function defaultToMap(map: Map<string, string>, key: string, value: string) {
  if (!map.has(key)) map.set(key, value);
}

function move2(map: string[][], robotPos: { x: number; y: number }, command: string): boolean {
  const { x: dx, y: dy } = MOVES[command];

  const spaces = [{ x: robotPos.x + dx, y: robotPos.y + dy }];
  const moves = new Map<string, string>([
    [getKey(robotPos.x, robotPos.y), "."],
    [getKey(robotPos.x + dx, robotPos.y + dy), "@"],
  ]);
  let next;
  while ((next = spaces.shift())) {
    const nextField = map[next.y][next.x];
    if (nextField === "#") return;

    if (dy === 0) {
      if (nextField === "[" || nextField === "]") {
        spaces.push({ x: next.x + dx, y: next.y });
        defaultToMap(moves, getKey(next.x + dx, next.y), nextField);
      }
      continue;
    }
    if (nextField === "[") {
      spaces.push({ x: next.x, y: next.y + dy });
      defaultToMap(moves, getKey(next.x, next.y + dy), "[");
      spaces.push({ x: next.x + 1, y: next.y + dy });
      defaultToMap(moves, getKey(next.x + 1, next.y + dy), "]");
      defaultToMap(moves, getKey(next.x + 1, next.y), ".");
    }
    if (nextField === "]") {
      spaces.push({ x: next.x, y: next.y + dy });
      defaultToMap(moves, getKey(next.x, next.y + dy), "]");
      spaces.push({ x: next.x - 1, y: next.y + dy });
      defaultToMap(moves, getKey(next.x - 1, next.y + dy), "[");
      defaultToMap(moves, getKey(next.x - 1, next.y), ".");
    }
  }
  robotPos.x += dx;
  robotPos.y += dy;
  for (const key of moves.keys()) {
    const { x, y } = getCoords(key);
    map[y][x] = moves.get(key);
  }
}

function second(inputString: string) {
  const { map, robotPos, commands } = parseInput(inputString, true);

  commands.forEach((command) => {
    move2(map, robotPos, command);
  });

  let sum = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "[") {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};

// > 1511833
