function first(inputString: string) {
  const map = inputString.split("\n");
  const dimX = map[0].length;
  const dimY = map.length;
  let counter = 0;

  for (let x = 0; x < dimX; x++) {
    // top edge
    counter += findAll(map, x, 0, 0, 1);
    counter += findAll(map, x, 0, 1, 1);
    counter += findAll(map, x, 0, -1, 1);

    // bottom edge
    counter += findAll(map, x, dimY - 1, 0, -1);
    counter += findAll(map, x, dimY - 1, 1, -1);
    counter += findAll(map, x, dimY - 1, -1, -1);
  }

  for (let y = 0; y < dimY; y++) {
    // left edge
    counter += findAll(map, 0, y, 1, 0);
    if (y !== 0) counter += findAll(map, 0, y, 1, 1);
    if (y !== dimY - 1) counter += findAll(map, 0, y, 1, -1);

    // right edge
    counter += findAll(map, dimX - 1, y, -1, 0);
    if (y !== 0) counter += findAll(map, dimX - 1, y, -1, 1);
    if (y !== dimY - 1) counter += findAll(map, dimX - 1, y, -1, -1);
  }

  return counter;
}

const nextCharMap = new Map([
  ["X", "M"],
  ["XM", "A"],
  ["XMA", "S"],
  ["XMAS", "X"],
]);

function findAll(map: string[], startX: number, startY: number, dirX: number, dirY: number): number {
  const dimX = map[0].length;
  const dimY = map.length;

  let x = startX;
  let y = startY;
  let word = "";
  let counter = 0;

  while (isValid(dimX, dimY, x, y)) {
    const expectedNextChar = nextCharMap.get(word);
    const char = map[y][x];

    if (expectedNextChar === char) {
      word += char;
    } else {
      word = char;
    }
    if (word === "XMAS") {
      counter++;
      word = "";
    }

    x += dirX;
    y += dirY;
  }

  return counter;
}

function isValid(dimX: number, dimY: number, x: number, y: number) {
  return x > -1 && x < dimX && y > -1 && y < dimY;
}

function second(inputString: string) {
  const map = inputString.split("\n");
  const dimX = map[0].length;
  const dimY = map.length;
  let counter = 0;
  for (let x = 1; x < dimX - 1; x++) {
    for (let y = 1; y < dimY - 1; y++) {
      if (map[y][x] !== "A") continue;

      const topLeft = map[y - 1][x - 1];
      const topRight = map[y - 1][x + 1];
      const bottomLeft = map[y + 1][x - 1];
      const bottomRight = map[y + 1][x + 1];

      const first = (topLeft === "M" && bottomRight === "S") || (topLeft === "S" && bottomRight === "M");
      const second = (topRight === "M" && bottomLeft === "S") || (topRight === "S" && bottomLeft === "M");
      if (first && second) counter++;
    }
  }
  return counter;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
