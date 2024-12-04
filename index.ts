import * as fs from "fs";

const ID = 4;

const run = async () => {
  const scriptModule = await import(`./solutions/day${ID}`);
  const data = fs.readFileSync(`./data/day${ID}.txt`).toString();

  const start = Date.now();
  const result = scriptModule.default(data);
  console.log((Date.now() - start) / 1000, " s");

  console.log(result);
};

run();
