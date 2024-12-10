function first(inputString: string) {
  let frontIndex = -1;
  let endIndex = inputString.length - 1;

  let isFile = true;

  const numbers = [];
  const endCache = [];
  while (frontIndex < endIndex) {
    frontIndex++;

    if (isFile) {
      const value = parseInt(inputString[frontIndex]);
      for (let j = 0; j < value; ++j) {
        numbers.push(frontIndex / 2);
      }
      isFile = false;
    } else {
      const value = parseInt(inputString[frontIndex]);
      for (let j = 0; j < value; ++j) {
        if (endCache.length === 0) {
          const endValue = parseInt(inputString[endIndex]);
          for (let jEnd = 0; jEnd < endValue; ++jEnd) {
            endCache.push(endIndex / 2);
          }
          endIndex -= 2;
        }

        const endNumber = endCache.pop();
        numbers.push(endNumber);
      }
      isFile = true;
    }
  }
  const totalNumbers = numbers.concat(endCache);
  return totalNumbers.reduce((sum, val, id) => sum + val * id, 0);
}

function second(inputString: string) {
  const inputArray = [];
  let totalCount = 0;
  let value = 0;
  for (const char of inputString) {
    const counter = parseInt(char);
    for (let i = 0; i < counter; i++) {
      if (value % 2 === 0) inputArray.push(value / 2);
      else inputArray.push(null);
    }
    value++;
  }

  let number;
  let counter;
  const moved = new Set();

  for (let i = inputArray.length - 1; i > 0; i--) {
    const nextNumber = inputArray[i];
    if (nextNumber !== number) {
      // change at the end between file and space
      if (number != null && !moved.has(number)) {
        // we reached the start of the file at the end
        let spaceCounter = 0;
        let isSpaceInFront = true;
        í;
        for (let j = 0; j <= i + 1; j++) {
          // finding an empty space in the start
          const startNumber = inputArray[j];
          if (startNumber !== null) {
            // at the end of a space
            if (spaceCounter >= counter) {
              // long enough space
              // filling the space
              for (let k = 0; k < counter; k++) {
                inputArray[j - spaceCounter + k] = number;
                inputArray[i + k + 1] = null;
              }
              moved.add(number);
              break;
              // emptying the back number
            }
            isSpaceInFront = false;
            spaceCounter = 0;
          } else {
            isSpaceInFront = true;
            spaceCounter++;
          }
        }
      }
      number = nextNumber;
      counter = 1;
    } else {
      if (number === null) continue;
      counter++;
    }
  }
  // console.log(inputArray);

  return inputArray.reduce((sum, val, id) => sum + val * id, 0);
}

export default (inputString: string) => {
  return {
    first: first(inputString),
    second: second(inputString),
  };
};
