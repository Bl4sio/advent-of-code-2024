class Node {
  readonly id: string;
  readonly connections: Set<string>;

  constructor(id: string) {
    this.id = id;
    this.connections = new Set();
  }
}

function parseInput(inputString: string): Map<string, Node> {
  const nodes = new Map<string, Node>();
  inputString.split("\r\n").forEach((pairs) => {
    const [id1, id2] = pairs.split("-");

    const node1 = nodes.get(id1) ?? new Node(id1);
    node1.connections.add(id2);
    nodes.set(id1, node1);

    const node2 = nodes.get(id2) ?? new Node(id2);
    node2.connections.add(id1);
    nodes.set(id2, node2);
  });

  return nodes;
}

function getKey(ids: string[]): string {
  return ids.sort().join("|");
}

function first(inputString: string) {
  const indexedNodes = parseInput(inputString);
  const nodes = [...indexedNodes.values()];
  const triplets = new Set();
  nodes
    .filter((node) => node.id.startsWith("t"))
    .forEach((node) => {
      node.connections.forEach((connectionId) => {
        const connectionNode = indexedNodes.get(connectionId);
        const commonConnections = connectionNode.connections.intersection(node.connections);
        commonConnections.forEach((thirdId) => {
          triplets.add(getKey([node.id, connectionId, thirdId]));
        });
      });
    });

  return triplets.size;
}

function second(inputString: string) {
  const parsed = parseInput(inputString);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
