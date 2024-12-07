interface Line {
  result: number;
  numbers: number[];
}

function readLines(inputString: string): Line[] {
  return inputString.split("\n").map((line) => {
    const [resultString, numberString] = line.split(":");
    return {
      result: parseInt(resultString),
      numbers: numberString
        .trim()
        .split(" ")
        .map((x) => parseInt(x)),
    };
  });
}

function isValidLine(line: Line): boolean {
  const { result, numbers } = line;

  return next(result, numbers, 1, numbers[0]);
}

function next(result: number, numbers: number[], id: number, increment: number): boolean {
  if (id === numbers.length) return result === increment; // last number
  if (id > numbers.length) return false; // overindexing

  const nextNumber = numbers[id];

  const nextMul = next(result, numbers, id + 1, increment * nextNumber);
  const nextSum = next(result, numbers, id + 1, increment + nextNumber);
  return nextMul || nextSum;
}

function first(inputString: string) {
  const lines = readLines(inputString);
  const validLines = lines.filter(isValidLine);
  return validLines.reduce((sum, line) => sum + line.result, 0);
}

function isValidLine2(line: Line): boolean {
  const { result, numbers } = line;

  return next2(result, numbers, 1, numbers[0]);
}

function next2(result: number, numbers: number[], id: number, increment: number): boolean {
  if (id === numbers.length) return result === increment; // last number
  if (increment > result) return false; // number to big
  if (id > numbers.length) return false; // overindexing

  const nextNumber = numbers[id];

  const nextMul = next2(result, numbers, id + 1, increment * nextNumber);
  const nextSum = next2(result, numbers, id + 1, increment + nextNumber);
  const nextConcat = next2(result, numbers, id + 1, parseInt(`${increment}${nextNumber}`));
  return nextMul || nextSum || nextConcat;
}

function second(inputString: string) {
  const lines = readLines(inputString);
  const validLines = lines.filter(isValidLine2);
  return validLines.reduce((sum, line) => sum + line.result, 0);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
