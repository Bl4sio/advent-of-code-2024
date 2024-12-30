function parseInput(inputString: string) {
  const keys: number[][] = [];
  const locks: number[][] = [];

  let isLock = false;
  let item: number[];
  inputString.split("\r\n").forEach((row) => {
    if (row === "") {
      if (isLock) locks.push(item);
      else keys.push(item);

      item = undefined;
      return;
    }

    if (!item) {
      isLock = row === "#####";
      item = new Array(5).fill(isLock ? 0 : -1);
      return;
    }

    row.split("").forEach((pin, i) => {
      if (pin === "#") item[i]++;
    });
  });

  if (item) {
    if (isLock) locks.push(item);
    else keys.push(item);
  }

  return { keys, locks };
}

function first(inputString: string) {
  const { locks, keys } = parseInput(inputString);

  let pairs = 0;
  locks.forEach((lock) => {
    keys.forEach((key) => {
      if (
        key.every((pin, i) => {
          return lock[i] + pin < 6;
        })
      )
        pairs++;
    });
  });

  return pairs;
}

function second(inputString: string) {
  const { locks, keys } = parseInput(inputString);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
