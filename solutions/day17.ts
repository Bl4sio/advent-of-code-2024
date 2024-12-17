import { appendFileSync } from "fs";

function parseInput(inputString: string): bigint[] {
  const lines = inputString.split("\r\n");
  registers.A = BigInt(lines[0].split(": ")[1]);
  registers.B = BigInt(lines[1].split(": ")[1]);
  registers.C = BigInt(lines[2].split(": ")[1]);
  registers.int = 0;
  registers.out = [];

  const program = lines[4]
    .slice(9)
    .split(",")
    .map((c) => BigInt(c));

  return program;
}

const registers = {
  A: 0n,
  B: 0n,
  C: 0n,
  int: 0,
  out: [],
};

function combo(x: bigint) {
  if (x < 4n) return x;
  if (x === 4n) return registers.A;
  if (x === 5n) return registers.B;
  if (x === 6n) return registers.C;
  throw Error(`Invalid combo operand ${x}`);
}

const operandMap = {
  // adv
  0: (x: bigint) => {
    registers.A = registers.A >> combo(x);
  },
  //bxl
  1: (x: bigint) => {
    registers.B = registers.B ^ x;
  },
  //bst
  2: (x: bigint) => {
    registers.B = combo(x) % 8n;
  },
  //jnz
  3: (x: bigint) => {
    if (registers.A === 0n) return;
    registers.int = Number(x) - 2;
  },
  //bxc
  4: (x: bigint) => {
    registers.B = registers.B ^ registers.C;
  },
  // out
  5: (x: bigint) => {
    registers.out.push(combo(x) % 8n);
  },
  //bdv
  6: (x: bigint) => {
    registers.B = registers.A >> combo(x);
  },
  7: (x: bigint) => {
    registers.C = registers.A >> combo(x);
  },
};

function run(program: bigint[]): string {
  while (registers.int < program.length) {
    const opcode = program[registers.int];
    const operand = program[registers.int + 1];
    operandMap[Number(opcode)](operand);
    registers.int += 2;
  }
  return registers.out.join(",");
}

function first(inputString: string) {
  const program = parseInput(inputString);
  return run(program);
}

function resetRegisters(A: bigint) {
  registers.A = A;
  registers.B = 0n;
  registers.C = 0n;
  registers.int = 0;
  registers.out = [];
}

function second(inputString: string) {
  const program = parseInput(inputString);
  const targets = [...program];

  const startAs: bigint[] = [0n];
  const currentGoodAs: bigint[] = [];

  let targetResult = "";

  while (targets.length > 0) {
    const target = targets.pop();
    targetResult = targetResult ? `${target},${targetResult}` : `${target}`;

    while (startAs.length > 0) {
      const A = startAs.pop() << 3n;
      let inc = 0n;
      while (inc < 8n) {
        const startA = A + inc;

        resetRegisters(startA);
        const result = run(program);

        if (result === targetResult) currentGoodAs.push(startA);
        inc++;
      }
    }

    while (currentGoodAs.length > 0) {
      const goodA = currentGoodAs.pop();
      startAs.push(goodA);
    }
  }

  return `${startAs[0]}; Is only solution: ${startAs.length === 1}`;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
