const nextDirMapping = {
  "1|0": { dirX: 0, dirY: 1 },
  "0|1": { dirX: -1, dirY: 0 },
  "-1|0": { dirX: 0, dirY: -1 },
  "0|-1": { dirX: 1, dirY: 0 },
};

function first(inputString: string) {
  const map = inputString.split("\n");
  let { posX, posY, dirX, dirY } = getStart(map);

  const visisted = new Set([getKey([posX, posY])]);

  while (true) {
    const frontSquare = map[posY + dirY]?.[posX + dirX];

    if (frontSquare === undefined) break;
    if (frontSquare === "#") {
      const dirKey = getKey([dirX, dirY]);
      const nextDir = nextDirMapping[dirKey];
      dirX = nextDir.dirX;
      dirY = nextDir.dirY;
      continue;
    }
    posX += dirX;
    posY += dirY;
    visisted.add(getKey([posX, posY]));
  }

  return visisted.size;
}

function getStart(map: string[]) {
  const startChars = new Set([">", "<", "^", "v"]);
  let posX, posY;
  let dirX, dirY;
  map.find((row, y) => {
    return [...row].find((char, x) => {
      if (!startChars.has(char)) return false;
      posX = x;
      posY = y;
      switch (char) {
        case ">":
          dirX = 1;
          dirY = 0;
          break;
        case "<":
          dirX = -1;
          dirY = 0;
          break;
        case "v":
          dirX = 0;
          dirY = 1;
          break;
        case "^":
          dirX = 0;
          dirY = -1;
          break;
      }

      return true;
    });
  });

  return { posX, posY, dirX, dirY };
}

function getKey(ids: number[]) {
  return ids.join("|");
}

interface CandidateData {
  map: string[];
  startPos: { posX: number; posY: number; dirX: number; dirY: number };
  visited: Set<string>;
}

function second(inputString: string) {
  const map = inputString.split("\n");
  let { posX, posY, dirX, dirY } = getStart(map);

  const candidates = new Set(); // store the possible new blockade positions
  const candidateData: CandidateData[] = []; // store the required data to calculate a candidate

  const startKey = getKey([posX, posY]);
  const visistedFull = new Set([getKey([posX, posY, dirX, dirY])]);

  while (true) {
    const frontSquare = map[posY + dirY]?.[posX + dirX];

    if (frontSquare === undefined) break;
    if (frontSquare === "#") {
      const dirKey = getKey([dirX, dirY]);
      const nextDir = nextDirMapping[dirKey];
      dirX = nextDir.dirX;
      dirY = nextDir.dirY;

      continue;
    }

    posX += dirX;
    posY += dirY;

    const nextPosKey = getKey([posX, posY]);

    if (!candidates.has(nextPosKey) && nextPosKey !== startKey) {
      candidates.add(nextPosKey);
      candidateData.push({
        map: map.map((row, y) => {
          if (y === posY) return row.slice(0, posX) + "#" + row.slice(posX + 1, row.length);
          return row;
        }),
        startPos: { posX: posX - dirX, posY: posY - dirY, dirX, dirY },
        visited: new Set(visistedFull),
      });
    }

    visistedFull.add(getKey([posX, posY, dirX, dirY]));
  }

  const loopingCandidates = candidateData.filter(isLooping);
  return loopingCandidates.length;
}

function isLooping({ map, startPos, visited }: CandidateData): boolean {
  let dirX = startPos.dirX;
  let dirY = startPos.dirY;
  let posX = startPos.posX;
  let posY = startPos.posY;

  while (true) {
    const frontSquare = map[posY + dirY]?.[posX + dirX];
    if (frontSquare === undefined) return false; // escaped
    if (frontSquare === "#") {
      const dirKey = getKey([dirX, dirY]);
      const nextDir = nextDirMapping[dirKey];
      dirX = nextDir.dirX;
      dirY = nextDir.dirY;
      continue;
    }

    posX += dirX;
    posY += dirY;

    if (visited.has(getKey([posX, posY, dirX, dirY]))) return true; // looping
    visited.add(getKey([posX, posY, dirX, dirY]));
  }
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
