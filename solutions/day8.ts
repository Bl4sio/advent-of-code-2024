function parseInput(inputString: string): {
  allAnntenas: { x: number; y: number }[][];
  dimX: number;
  dimY: number;
} {
  const map = inputString.split("\r\n");
  const dimX = map[0].length;
  const dimY = map.length;
  const allAnntenas = new Map<string, { x: number; y: number }[]>();
  map.forEach((row, y) => {
    for (let x = 0; x < row.length; ++x) {
      const field = row[x];
      if (field === ".") continue;
      const antennas = allAnntenas.get(field) ?? [];
      antennas.push({ x, y });
      allAnntenas.set(field, antennas);
    }
  });

  return { allAnntenas: [...allAnntenas.values()], dimX, dimY };
}

function isValid(position: { x: number; y: number }, dimX: number, dimY: number): boolean {
  if (position.x < 0 || position.y < 0) return false;
  if (position.x >= dimX || position.y >= dimY) return false;
  return true;
}

function getKey(position: { x: number; y: number }): string {
  return `${position.x}|${position.y}`;
}

function calculateImpacts(
  antennas: { x: number; y: number }[],
  dimX: number,
  dimY: number,
  uniqueLocations: Set<string>
) {
  for (let i = 0; i < antennas.length; ++i) {
    for (let j = 0; j < antennas.length; ++j) {
      if (i === j) continue;
      const antenna1 = antennas[i];
      const antenna2 = antennas[j];
      const diffX = antenna1.x - antenna2.x;
      const diffY = antenna1.y - antenna2.y;
      const location = { x: antenna1.x + diffX, y: antenna1.y + diffY };
      if (isValid(location, dimX, dimY)) uniqueLocations.add(getKey(location));
    }
  }
}

function first(inputString: string) {
  const uniqueLocations = new Set<string>();

  const { allAnntenas, dimX, dimY } = parseInput(inputString);
  allAnntenas.forEach((antennas) => calculateImpacts(antennas, dimX, dimY, uniqueLocations));

  return uniqueLocations.size;
}

function calculateImpacts2(
  antennas: { x: number; y: number }[],
  dimX: number,
  dimY: number,
  uniqueLocations: Set<string>
) {
  for (let i = 0; i < antennas.length; ++i) {
    for (let j = 0; j < antennas.length; ++j) {
      if (i === j) continue;
      const antenna1 = antennas[i];
      const antenna2 = antennas[j];
      const diffX = antenna1.x - antenna2.x;
      const diffY = antenna1.y - antenna2.y;
      const location = { x: antenna1.x, y: antenna1.y };
      while (isValid(location, dimX, dimY)) {
        uniqueLocations.add(getKey(location));
        location.x += diffX;
        location.y += diffY;
      }
    }
  }
}

function second(inputString: string) {
  const uniqueLocations = new Set<string>();

  const { allAnntenas, dimX, dimY } = parseInput(inputString);
  allAnntenas.forEach((antennas) => calculateImpacts2(antennas, dimX, dimY, uniqueLocations));

  return uniqueLocations.size;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
