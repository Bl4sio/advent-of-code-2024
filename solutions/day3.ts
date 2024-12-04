function first(inputString: string) {
  const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
  const matches = inputString.match(regex);

  return matches.reduce((sum, operation) => {
    const numbers = operation
      .slice(4, -1)
      .split(",")
      .map((x) => parseInt(x));
    return sum + numbers[0] * numbers[1];
  }, 0);
}

function second(inputString: string) {
  const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)|don't|do/g;
  const matches = inputString.match(regex);

  let enabled = true;
  return matches.reduce((sum, operation) => {
    if (operation === "do") {
      enabled = true;
      return sum;
    }
    if (operation === "don't") {
      enabled = false;
      return sum;
    }
    if (!enabled) return sum;

    const numbers = operation
      .slice(4, -1)
      .split(",")
      .map((x) => parseInt(x));
    return sum + numbers[0] * numbers[1];
  }, 0);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
