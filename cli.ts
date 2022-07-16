#!/usr/bin/env node
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import dotenv from 'dotenv';
import {doSomeStuff} from './src/doSomeStuff';

dotenv.config();
const defaultThisThing: string = process.env.THIS_THING || 'error this thing';
const defaultAndThat: string = process.env.AND_THAT || 'error that thing';

yargs(hideBin(process.argv))
  .command(
    'start',
    'start the process',
    () => {},
    argv => {
      doSomeStuff(argv.thisThing as string, argv.andThat as string);
    }
  )
  .option('thisThing', {
    alias: 'this',
    type: 'string',
    description: 'this thing',
    default: defaultThisThing,
  })
  .option('andThat', {
    alias: 'that',
    type: 'string',
    description: 'that thing',
    default: defaultAndThat,
  })
  .parse();
