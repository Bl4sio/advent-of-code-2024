function isValidReport(report: number[]) {
  let isIncreasing: boolean | undefined;
  let prev: number | undefined;

  return report.every((current) => {
    if (prev === undefined) {
      prev = current;
      return true;
    }
    if (isIncreasing === undefined) {
      isIncreasing = current > prev;
    }

    const isDirectionGood = isIncreasing === current > prev;
    const diff = Math.abs(current - prev);
    const isDiffGood = diff < 4 && diff > 0;

    prev = current;
    return isDirectionGood && isDiffGood;
  });
}

function first(inputString: string) {
  const reports = inputString.split("\n").map((report) => report.split(" ").map((x) => parseInt(x)));

  const validReports = reports.filter((report) => {
    return isValidReport(report);
  });

  return validReports.length;
}

function second(inputString: string) {
  const reports = inputString.split("\n").map((report) => report.split(" ").map((x) => parseInt(x)));
  const reportsWithVariants: number[][][] = [];

  reports.forEach((report) => {
    const length = report.length;
    const variants = [report];
    for (let i = 0; i < length; i++) {
      variants.push([...report.slice(0, i), ...report.slice(i + 1, length)]);
    }
    reportsWithVariants.push(variants);
  });

  const validReports = reportsWithVariants.filter((variants) => {
    return variants.find((variant) => isValidReport(variant));
  });

  return validReports.length;
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
