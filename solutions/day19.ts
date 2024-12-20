function parseInput(inputString: string): { towels: string[]; patterns: string[] } {
  const lines = inputString.split("\r\n");
  const towels = lines[0].split(", ");
  const patterns = lines.slice(2);
  return { towels, patterns };
}

function isValid(pattern: string, towels: string[]): boolean {
  if (pattern.length === 0) return true;

  return !!towels.find((towel) => {
    if (!pattern.startsWith(towel)) return false;
    return isValid(pattern.slice(towel.length), towels);
  });
}

function countVariants(pattern: string, towels: string[], cache: Map<string, number>): number {
  if (pattern.length === 0) return 1;
  if (cache.has(pattern)) return cache.get(pattern);

  const variants = towels.reduce((sum, towel) => {
    if (!pattern.startsWith(towel)) return sum;
    return sum + countVariants(pattern.slice(towel.length), towels, cache);
  }, 0);

  cache.set(pattern, variants);
  return variants;
}

function first(inputString: string) {
  const { patterns, towels } = parseInput(inputString);

  const validPatterns = patterns.filter((pattern) => isValid(pattern, towels));

  return validPatterns.length;
}

function second(inputString: string) {
  const { patterns, towels } = parseInput(inputString);

  const cache = new Map<string, number>();
  const validPatterns = patterns.reduce((sum, pattern) => sum + countVariants(pattern, towels, cache), 0);

  return validPatterns;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
