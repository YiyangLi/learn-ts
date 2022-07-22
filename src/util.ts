/*
 * A Promise that is always resolved after n milliseconds, n comes from the environment variable
 */
const sleepTime: number = getNumberOrElse(process.env.SLEEP_TIME, 1000);
export async function sleep(): Promise<void> {
  return new Promise(res => setTimeout(res, sleepTime));
}

/*
 * Generate a sequence of number 0, 1, 2, ..N
 */
export function generateSequence(n: number): number[] {
  return n > 0 ? Array.from(new Array(n).keys()) : [];
}

/**
 * Given the total size and the size of each batch, generate batches
 * e.g. if totalSize = 5, and totalBatch is 2
 * the return would be [[0, 2, 4], [1, 3]]
 * * totalSize: the total number of elements
 * * totalBatch: the size of final batches
 */
export function generateBatches(
  totalSize: number,
  totalBatch: number
): number[][] {
  if (totalBatch > totalSize) {
    totalBatch = totalSize;
  }
  const batches: number[][] = new Array<number[]>(totalBatch);
  const sequence = generateSequence(totalSize);
  while (sequence.length) {
    for (let j = 0; j < totalBatch && sequence.length; j = j + 1) {
      if (!batches[j]) {
        batches[j] = new Array<number>();
      }
      batches[j].push(sequence.shift()!);
    }
  }
  return batches;
}

/*
 * parse a string to a number, if it's not a number, use the defaultVal
 */
export function getNumberOrElse(val: string | undefined, defaultVal: number) {
  const str = val || '';
  return isNaN(parseInt(str)) ? defaultVal : parseInt(str);
}
