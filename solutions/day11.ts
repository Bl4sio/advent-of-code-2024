function blink(number: number) {
  if (number === 0) return [1];
  const stringNumber = number.toString();
  if (stringNumber.length % 2 === 0) {
    return [
      parseInt(stringNumber.slice(0, stringNumber.length / 2)),
      parseInt(stringNumber.slice(stringNumber.length / 2, stringNumber.length)),
    ];
  }
  return [number * 2024];
}

function calc(inputString: string, rounds: number) {
  let lights = new Map<number, number>();
  inputString.split(" ").forEach((x) => {
    const number = parseInt(x);
    const counts = lights.get(number) ?? 0;
    lights.set(number, counts + 1);
  });

  for (let i = 0; i < rounds; i++) {
    const nextLights = new Map<number, number>();
    for (const number of lights.keys()) {
      const counts = lights.get(number);
      blink(number).forEach((nextNumber) => {
        const nextCounts = nextLights.get(nextNumber) ?? 0;
        nextLights.set(nextNumber, nextCounts + counts);
      });
    }
    lights = nextLights;
  }

  let sum = 0;
  for (const count of lights.values()) {
    sum += count;
  }
  return sum;
}

function first(inputString: string) {
  return calc(inputString, 25);
}

function second(inputString: string) {
  return calc(inputString, 75);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
