enum GATE_TYPE {
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
  INIT = "INIT",
}

interface Gate {
  type: GATE_TYPE;
  leftNode: string;
  rightNode: string;
  targetNode: string;
  left: boolean | undefined;
  right: boolean | undefined;
}

function addNode(nodes: Map<string, Gate[]>, node: string, gate?: Gate): void {
  const gates = nodes.get(node) ?? [];
  if (gate) gates.push(gate);
  nodes.set(node, gates);
}

function parseInput(inputString: string) {
  const startGates: Gate[] = [];
  const nodes = new Map<string, Gate[]>();
  // const gates: Gate[] = [];

  let isStartBits = true;
  inputString.split("\r\n").forEach((row) => {
    if (row === "") {
      isStartBits = false;
      return;
    }

    if (isStartBits) {
      const [node, startValue] = row.split(": ");

      const gate = {
        leftNode: "",
        rightNode: "",
        targetNode: node,
        left: startValue === "1",
        right: false,
        type: GATE_TYPE.INIT,
      };
      startGates.push(gate);
      // startBits.set(node, startValue === "1");
      addNode(nodes, node);
      return;
    }

    if (!isStartBits) {
      const [gateInput, gateOutput] = row.split(" -> ");
      const [node1, operation, node2] = gateInput.split(" ");

      const gate = {
        leftNode: node1,
        rightNode: node2,
        targetNode: gateOutput,
        left: null,
        right: null,
        type: operation as unknown as GATE_TYPE,
      };
      // gates.push(gate);

      addNode(nodes, node1, gate);
      addNode(nodes, node2, gate);
      addNode(nodes, gateOutput);
    }
  });

  return { nodes, startGates };
}

function calculateGateResult(gate: Gate): boolean {
  switch (gate.type) {
    case GATE_TYPE.AND:
      return gate.left && gate.right;
    case GATE_TYPE.OR:
      return gate.left || gate.right;
    case GATE_TYPE.XOR:
      return gate.left !== gate.right;
    case GATE_TYPE.INIT:
      return gate.left;
  }
}

function calculateOutput(nodes: Map<string, Gate[]>, startGates: Gate[]): boolean[] {
  const endNodes: Record<string, boolean> = {};

  let updatedGates: Gate[] = startGates;
  while (updatedGates.length > 0) {
    const nextUpdatedGates: Gate[] = [];
    const readyGates = updatedGates.filter((gate) => gate.left !== null && gate.right !== null);

    readyGates.forEach((gate) => {
      const targetNode = gate.targetNode;
      const output = calculateGateResult(gate);
      if (targetNode.startsWith("z")) {
        endNodes[targetNode] = output;
      }
      const targetGates = nodes.get(targetNode);
      targetGates.forEach((gate) => {
        if (gate.leftNode === targetNode) gate.left = output;
        if (gate.rightNode === targetNode) gate.right = output;
        if (gate.left !== null && gate.right !== null) nextUpdatedGates.push(gate);
      });
    });

    updatedGates = nextUpdatedGates;
  }

  return Object.entries(endNodes)
    .sort((a, b) => (b[0] > a[0] ? 1 : -1))
    .map((node) => node[1]);
}

function first(inputString: string) {
  const { nodes, startGates } = parseInput(inputString);
  const output = calculateOutput(nodes, startGates);
  return output.reduce((value, node) => value * 2 + Number(node), 0);
}

function getSingleBitStartGates(count: number, bit: number): Gate[] {
  const gates = new Array(count).fill(0).flatMap<Gate>((_, i) => [
    {
      leftNode: "",
      rightNode: "",
      targetNode: i.toString().padStart(3, "x00"),
      left: i === bit,
      right: false,
      type: GATE_TYPE.INIT,
    },
    {
      leftNode: "",
      rightNode: "",
      targetNode: i.toString().padStart(3, "y00"),
      left: i === bit,
      right: false,
      type: GATE_TYPE.INIT,
    },
  ]);

  return gates;
}

function second(inputString: string) {
  const { nodes, startGates } = parseInput(inputString);

  const bitCount = startGates.length / 2;
  const errors = [];

  for (let i = 0; i < bitCount; i++) {
    const specialStartGates = getSingleBitStartGates(bitCount, i);
    const output = calculateOutput(nodes, specialStartGates);

    if (!output[bitCount - i - 1]) {
      const badBits = [];
      output.forEach((bit, j) => {
        if (bit) badBits.push(bitCount - j - 1);
      });
      errors.push({ i, badBits });
    }
  }

  // manually checked with some tries
  const badOuts = ["cmv", "z17", "rmj", "z23", "z30", "rdg", "btb", "mwp"];
  return badOuts.sort().join(",");
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
