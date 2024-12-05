function parseInput(inputString: string) {
  // key the second number and the set contains the "blocked" numbers
  const rules = new Map<number, Set<number>>();
  const manuals: number[][] = [];
  let isRules = true;

  inputString.split("\n").forEach((line) => {
    if (line === "\r") {
      isRules = false;
      return;
    }

    if (isRules) {
      const [first, second] = line.split("|").map((x) => parseInt(x));
      const exclusions = rules.get(second) ?? new Set();
      exclusions.add(first);
      rules.set(second, exclusions);
    } else {
      const numbers = line.split(",").map((x) => parseInt(x));
      manuals.push(numbers);
    }
  });

  return { rules, manuals };
}

function first(inputString: string) {
  const { rules, manuals } = parseInput(inputString);

  const validManuals = manuals.filter((manual) => {
    const excluded = new Set();
    return manual.every((number) => {
      if (excluded.has(number)) return false;
      const newExclusion = rules.get(number) ?? [];
      newExclusion.forEach((x) => excluded.add(x));
      return true;
    });
  });

  return validManuals.reduce((sum, manual) => {
    return sum + manual[Math.floor(manual.length / 2)];
  }, 0);
}

function second(inputString: string) {
  const { rules, manuals } = parseInput(inputString);

  const invalidManuals = manuals.filter((manual) => {
    const excluded = new Set();
    return !manual.every((number) => {
      if (excluded.has(number)) return false;
      const newExclusion = rules.get(number) ?? new Set();
      newExclusion.forEach((x) => excluded.add(x));
      return true;
    });
  });

  return invalidManuals.reduce((sum, manual) => {
    manual.sort((x, y) => {
      const excludedByY = rules.get(y) ?? new Set();
      if (excludedByY.has(x)) return -1;
      return 1;
    });
    return sum + manual[Math.floor(manual.length / 2)];
  }, 0);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
