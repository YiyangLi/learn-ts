import fetch from 'node-fetch';
import {randomUUID} from 'crypto';
import dotenv from 'dotenv';
import {sleep, generateSequence, generateBatches} from './util';

dotenv.config();
const baseUrl: string = process.env.BASE_URL || 'http://localhost:3000';

/*
 * Send one message to `{base_url}/publish`, the `base_url` is read from environment variable BASE_URL
 * To spin up the server, use [pubsubyy](https://github.com/YiyangLi/learn-pubsub) after installation:
 *    `pubsubyy start`
 * Or you could comment out the part and only print the message to stdout
 * To simulate a latency, the process will sleep 1 second before sending the message.
 *
 * * message: the message you want to send, if not defined, it will be a random UUID
 * * return 'okay' for 2XX status, and '{status}:{reason}' for others
 */
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

/*
 * Send multiple messages to `{base_url}/publish` sequentially
 * To simulate a latency, the process will sleep 1 second before sending each message.
 *
 * * size: the size of messages you want to send
 * * message: the message you want to send, if not defined, it will be a random UUID
 * * return a list of responses
 */
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

/*
 * Send multiple messages to `{base_url}/publish` concurrently
 * To simulate a latency, the process will sleep 1 second before sending each message.
 *
 * * size: the size of messages you want to send, which is also the concurrency number
 * * message: the message you want to send, if not defined, it will be a random UUID
 * * return a list of responses
 */
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

/*
 * Send multiple messages to `{base_url}/publish` concurrently, but in batches
 * There might be a limitation on the concurrency, put messages in batches.
 * Each batch is a "thread", and messages in a batch are sent sequentially.
 *
 * * totalSize: the size of messages you want to send
 * * totalBatch: the size of batches, which is also the concurrency number
 * * message: the message you want to send, if not defined, it will be a random UUID
 * * return a list of responses
 */
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
