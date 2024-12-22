function parseInput(inputString: string): bigint[] {
  return inputString.split("\r\n").map((x) => BigInt(x));
}

function mixNPrune(result: bigint, secret: bigint): bigint {
  const nextSecret = result ^ secret;
  return nextSecret % 16777216n;
}

function calc(secret: bigint): bigint {
  const first = mixNPrune(secret << 6n, secret);
  const second = mixNPrune(first >> 5n, first);
  const third = mixNPrune(second << 11n, second);
  return third;
}

function first(inputString: string) {
  const numbers = parseInput(inputString);

  let total = 0n;
  numbers.forEach((number) => {
    let secret = number;
    for (let i = 0; i < 2000; i++) {
      secret = calc(secret);
    }
    total += secret;
  });

  return total;
}

function getKey(code: number[]): string {
  return code.join("|");
}

function second(inputString: string) {
  const numbers = parseInput(inputString);

  const bestPrices = new Map<string, number>();

  numbers.map((number) => {
    const checkedCodes = new Set<string>();
    const code = [NaN, NaN, NaN, NaN];

    let secret = number;
    let lastPrice = 0;

    for (let i = 0; i < 2000; i++) {
      const price = Number(secret) % 10;
      const diff = price - lastPrice;
      lastPrice = price;
      code.shift();
      code.push(diff);

      if (i > 3) {
        const key = getKey(code);
        if (!checkedCodes.has(key)) {
          checkedCodes.add(key);
          const bestPrice = bestPrices.get(key) ?? 0;
          bestPrices.set(key, bestPrice + price);
        }
      }
      secret = calc(secret);
    }
  });

  return Math.max(...bestPrices.values());
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
