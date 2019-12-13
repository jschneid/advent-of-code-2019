import * as fs from 'fs';
import { IntcodeComputer } from './IntcodeComputer';

const computer: IntcodeComputer = new IntcodeComputer("day-13/input.txt");
computer.runProgram();

let blockTileCount = 0;

function processOutputs() {
  while (computer.outputQueue.length > 1) {
    const x = computer.outputQueue.shift();
    const y = computer.outputQueue.shift();
    const tileId = computer.outputQueue.shift();

    if (tileId === 2) {
      blockTileCount++;
    }
  }
}

while(true) {
  if (computer.terminated) {
    break;
  }

  processOutputs();

  // If the computer stopped running without terminating, then the program
  // is awaiting an input.
  throw "Unexpected input instruction";
  //computer.inputQueue.push(n);
  //computer.runProgram();
}

processOutputs();

console.log(blockTileCount);