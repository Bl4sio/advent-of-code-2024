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

type Graph = Map<string, Set<string>>;

function parseInputGraph(inputString: string): Graph {
  const graph = new Map();
  inputString.split("\r\n").forEach((pairs) => {
    const [node1, node2] = pairs.split("-");

    const connections1 = graph.get(node1) ?? new Set();
    connections1.add(node2);
    graph.set(node1, connections1);

    const connection2 = graph.get(node2) ?? new Set();
    connection2.add(node1);
    graph.set(node2, connection2);
  });

  return graph;
}

function bronKerbosch(graph: Graph, R: string[], P: string[], X: string[], results: string[][]): void {
  if (P.length === 0 && X.length === 0) {
    results.push([...R]);
    return;
  }

  const pivot = P[0] ?? X[0];
  const pivotNeighbours = graph.get(pivot);
  if (!pivotNeighbours) throw new Error(`Nincs a gráfban: ${pivot}`);

  for (const v of P.filter((vertex) => !pivotNeighbours.has(vertex))) {
    const neighbours = graph.get(v);
    if (!neighbours) throw new Error(`Nincs a gráfban: ${v}`);
    bronKerbosch(
      graph,
      [...R, v],
      P.filter((vertex) => neighbours.has(vertex)),
      X.filter((vertex) => neighbours.has(vertex)),
      results
    );
    P = P.filter((vertex) => vertex !== v);
    X.push(v);
  }
}

function second(inputString: string) {
  const graph = parseInputGraph(inputString);
  const result: string[][] = [];
  bronKerbosch(graph, [], [...graph.keys()], [], result);
  result.sort((a, b) => b.length - a.length);

  const biggest = result[0];

  return biggest.sort().join(",");
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
