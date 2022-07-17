import fetch from 'node-fetch';
import {randomUUID} from 'crypto';
import dotenv from 'dotenv';
import {sleep, generateSequence, generateBatches} from './util';

dotenv.config();
const baseUrl: string = process.env.BASE_URL || 'http://localhost:3000';

async function sendOneMessage(message: string): Promise<string> {
  await sleep(1000);
  const msg = message || randomUUID();
  //
  // console.log(`sent ${msg}`);
  // return 'okay';
  // uncomment above and comment out below if you don't want a server;
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: 'test',
      message: msg,
    }),
  };
  const response = await fetch(`${baseUrl}/publish`, config);
  if (response.status >= 200 && response.status < 300) {
    return 'okay';
  } else {
    return `${response.status}: ${JSON.stringify(response.json())}`;
  }
}

export async function sendSequentialRequests(
  size: number,
  message = '',
  arr: number[] = generateSequence(size)
): Promise<string[]> {
  return await arr.reduce(async (promises, elem) => {
    const rs = await promises;
    const response = await sendOneMessage(message);
    rs.push(`${elem}:${response}`);
    return rs;
  }, Promise.resolve(new Array<string>()));
}

export async function sendConcurrentRequests(
  size: number,
  message = '',
  arr: number[] = generateSequence(size)
): Promise<string[]> {
  return await Promise.all(
    arr.map(async elem => {
      const response = await sendOneMessage(message);
      return `${elem}:${response}`;
    })
  );
}

export async function sendRequestsInBatches(
  totalSize: number,
  totalBatch: number,
  message = ''
): Promise<string[]> {
  const batches = generateBatches(totalSize, totalBatch);
  const responses = await Promise.all(
    batches.map(async batch => {
      return await sendSequentialRequests(batch.length, message, batch);
    })
  );
  return responses.flat();
}
