interface Robot {
  p: { x: number; y: number };
  v: { x: number; y: number };
}

const DIM_X = 101;
const DIM_Y = 103;
// const DIM_X = 11;
// const DIM_Y = 7;

function parseData(inputString: string): Robot[] {
  return inputString.split("\r\n").map((line) => {
    const [p, v] = line.split(" ");
    const [x, y] = p.slice(2).split(",");
    const [dx, dy] = v.slice(2).split(",");
    return {
      p: { x: parseInt(x), y: parseInt(y) },
      v: { x: parseInt(dx), y: parseInt(dy) },
    };
  });
}

function calculate(robots: Robot[], rounds: number) {
  return robots.map((robot) => {
    const posX = (robot.p.x + robot.v.x * rounds + rounds * DIM_X) % DIM_X;
    const posY = (robot.p.y + robot.v.y * rounds + rounds * DIM_Y) % DIM_Y;
    return { x: posX, y: posY };
  });
}

function first(inputString: string) {
  const robots = parseData(inputString);
  const robotEnds = calculate(robots, 100);

  const quarters = [0, 0, 0, 0];
  robotEnds.forEach((robotEnd) => {
    if (robotEnd.x < DIM_X / 2 - 1) {
      if (robotEnd.y < DIM_Y / 2 - 1) quarters[0]++;
      else if (robotEnd.y > DIM_Y / 2) quarters[1]++;
    } else if (robotEnd.x > DIM_X / 2) {
      if (robotEnd.y < DIM_Y / 2 - 1) quarters[2]++;
      else if (robotEnd.y > DIM_Y / 2) quarters[3]++;
    }
  });

  return quarters.reduce((res, q) => res * q, 1);
}

function calcDist(robotEnds: { x: number; y: number }[]): number {
  let dist = 0;
  for (let i = 0; i < robotEnds.length; i++) {
    for (let j = i + 1; j < robotEnds.length; j++) {
      const robotA = robotEnds[i];
      const robotB = robotEnds[j];
      dist += Math.pow(robotA.x - robotB.x, 2);
      dist += Math.pow(robotA.y - robotB.y, 2);
    }
  }
  return dist;
}

function print(robotEnds: { x: number; y: number }[]): void {
  const map = new Array(DIM_Y).fill(0).map((row) => new Array(DIM_X).fill(0));
  robotEnds.forEach(({ x, y }) => map[y][x]++);
  map.forEach((row) => console.log(row.join("").replaceAll("0", " ")));
}

function second(inputString: string) {
  const robots = parseData(inputString);
  let sumDist = 0;
  let minDist = Infinity;
  let minI = 0;
  for (let i = 0; i < 100000; i++) {
    const robotEnds = calculate(robots, i);
    const nextDist = calcDist(robotEnds);
    sumDist += nextDist;
    minDist = Math.min(minDist, nextDist);
    if (minDist === nextDist) {
      minI = i;
      console.log("Új min dist!");
      console.log(i, minDist, sumDist / i);
      // print(robotEnds);
    }
  }
  return minI;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
