#!/usr/bin/env node
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import dotenv from 'dotenv';
import {
  sendConcurrentRequests,
  sendRequestsInBatches,
  sendSequentialRequests,
} from './main';
import {getNumberOrElse} from './util';

dotenv.config();
const message: string = process.env.MESSAGE || '';
const size: number = getNumberOrElse(process.env.SIZE, 10);
const concurrency: number = getNumberOrElse(process.env.CONCURRENCY, -1);

yargs(hideBin(process.argv))
  .command(
    'send',
    'send messages',
    () => {},
    async argv => {
      let responses: string[];
      if (argv.seq) {
        console.log('send message sequentially');
        responses = await sendSequentialRequests(
          argv.size as number,
          argv.message as string
        );
      } else {
        if (argv.concurrency === -1) {
          console.log('send messages concurrently');
          responses = await sendConcurrentRequests(
            argv.size as number,
            argv.message as string
          );
        } else {
          console.log(
            `send messages concurrently, max concurrency: ${argv.concurrency}`
          );
          responses = await sendRequestsInBatches(
            argv.size as number,
            argv.concurrency as number,
            argv.message as string
          );
        }
      }
      if (argv.log) {
        responses.forEach(r => console.log(r));
      }
    }
  )
  .option('message', {
    alias: 'm',
    type: 'string',
    description: 'the message',
    default: message,
  })
  .option('size', {
    alias: 'n',
    type: 'number',
    description: 'total message size',
    default: size,
  })
  .option('seq', {
    alias: 's',
    type: 'boolean',
    description: 'send message in a sequence',
    default: false,
  })
  .option('log', {
    alias: 'l',
    type: 'boolean',
    description: 'log results',
    default: false,
  })
  .option('concurrency', {
    alias: 'c',
    type: 'number',
    description: 'max concurrency',
    default: concurrency,
  })
  .parse();
