export async function sleep(n: number): Promise<void> {
  return new Promise(res => setTimeout(res, n));
}

export function generateSequence(n: number): number[] {
  return Array.from(Array(n).keys());
}

/**
 * Given the total size and the size of each batch, generate batches
 * e.g. if totalSize = 5, and totalBatch is 2
 * the return would be [[0, 2, 4], [1, 3]]
 */
export function generateBatches(
  totalSize: number,
  totalBatch: number
): number[][] {
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

export function getNumberOrElse(val: string | undefined, defaultVal: number) {
  return isNaN(parseInt(val || '')) ? defaultVal : parseInt(val || '');
}
