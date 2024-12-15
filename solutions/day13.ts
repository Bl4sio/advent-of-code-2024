import Decimal from "decimal.js";

interface ButtonData {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: number; y: number };
}

const parseData = (data: string): ButtonData[] => {
  const lines = data.split("\n");
  const machines: ButtonData[] = [];

  for (let i = 0; i < lines.length; i += 4) {
    const buttonA = lines[i].match(/X\+(\d+), Y\+(\d+)/);
    const buttonB = lines[i + 1].match(/X\+(\d+), Y\+(\d+)/);
    const prize = lines[i + 2].match(/X=(\d+), Y=(\d+)/);

    if (buttonA && buttonB && prize) {
      machines.push({
        buttonA: { x: parseInt(buttonA[1], 10), y: parseInt(buttonA[2], 10) },
        buttonB: { x: parseInt(buttonB[1], 10), y: parseInt(buttonB[2], 10) },
        prize: { x: parseInt(prize[1], 10), y: parseInt(prize[2], 10) },
      });
    }
  }

  return machines;
};

function solve(inputString: string, increment: number) {
  const machines = parseData(inputString);

  machines.forEach((machine) => {
    machine.prize.x += increment;
    machine.prize.y += increment;
  });

  let sum = 0;
  machines.forEach((machine) => {
    const B = new Decimal(machine.prize.x)
      .mul(machine.buttonA.y)
      .div(machine.buttonA.x)
      .minus(machine.prize.y)
      .div(new Decimal(machine.buttonA.y).mul(machine.buttonB.x).div(machine.buttonA.x).minus(machine.buttonB.y))
      .toNumber();

    const A = new Decimal(machine.buttonB.x).mul(B).neg().plus(machine.prize.x).div(machine.buttonA.x).toNumber();

    if (A % 1 !== 0 || B % 1 !== 0) return;
    sum += 3 * Math.round(A) + Math.round(B);
  });
  return sum;
}

function first(inputString: string) {
  return solve(inputString, 0);
}

function second(inputString: string) {
  return solve(inputString, 10000000000000);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
