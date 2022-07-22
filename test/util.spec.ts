import {
  generateSequence,
  sleep,
  generateBatches,
  getNumberOrElse,
} from '../src/util';

describe('generateSequence', () => {
  it('okay with an invalid input', () => {
    expect(generateSequence(-1)).toEqual([]);
  });

  it('okay with a valid input', () => {
    expect(generateSequence(5)).toEqual([0, 1, 2, 3, 4]);
  });
});

it('sleep', done => {
  sleep().then(done);
});

describe('generateBatches', () => {
  it('okay with normal inputs', () => {
    expect(generateBatches(4, 1)).toEqual([[0, 1, 2, 3]]);

    expect(generateBatches(5, 2)).toEqual([
      [0, 2, 4],
      [1, 3],
    ]);

    expect(generateBatches(15, 3)).toEqual([
      [0, 3, 6, 9, 12],
      [1, 4, 7, 10, 13],
      [2, 5, 8, 11, 14],
    ]);

    expect(generateBatches(3, 3)).toEqual([[0], [1], [2]]);
  });

  it('okay when batch size is larger', () => {
    expect(generateBatches(5, 6)).toEqual([[0], [1], [2], [3], [4]]);
  });
});

describe('getNumberOrElse', () => {
  it('okay with undefined', () => {
    expect(getNumberOrElse(undefined, 1)).toBe(1);
  });

  it('okay with a good string', () => {
    expect(getNumberOrElse('10', 1)).toBe(10);
  });

  it('okay with a bad string', () => {
    expect(getNumberOrElse('abc', 1)).toBe(1);
  });
});
