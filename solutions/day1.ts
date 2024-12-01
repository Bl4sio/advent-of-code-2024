function first(inputString: string) {
  const first: number[] = [];
  const second: number[] = [];
  inputString.split("\n").forEach((row) => {
    const [x, y] = row.split("   ").map((x) => parseInt(x));
    first.push(x);
    second.push(y);
  });

  first.sort();
  second.sort();
  let sum = 0;
  for (let i = 0; i < first.length; i++) {
    sum += Math.abs(first[i] - second[i]);
  }
  return sum;
}

function second(inputString: string) {
  const first: Map<number, number> = new Map();
  const second: Map<number, number> = new Map();
  inputString.split("\n").forEach((row) => {
    const [x, y] = row.split("   ").map((x) => parseInt(x));
    const xCount = first.get(x) ?? 0;
    first.set(x, xCount + 1);
    const yCount = second.get(y) ?? 0;
    second.set(y, yCount + 1);
  });

  let sum = 0;
  first.forEach((value, key) => {
    const multiplier = second.get(key) ?? 0;
    sum += value * key * multiplier;
  });

  return sum;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
