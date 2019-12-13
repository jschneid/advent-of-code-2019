import * as fs from 'fs';
import { IntcodeComputer } from './IntcodeComputer';

let paddleX: number;
let ballX: number;

let joystickDirection: number = 0;
let score: number;

function processOutputs() {
  while (computer.outputQueue.length > 1) {
    const x = computer.outputQueue.shift();
    const y = computer.outputQueue.shift();
    const tileId = computer.outputQueue.shift();

    if (x === -1 && y === 0) {
      score = tileId; 
      continue;
    }

    if (tileId === 3) {
      paddleX = x;
    }
    else if (tileId === 4) {
      ballX = x;
    }

    if (tileId === 3 || tileId === 4) {
      if (ballX < paddleX) {
        // Left
        joystickDirection = -1;
      }
      else if (paddleX < ballX) {
        // Right
        joystickDirection = 1;
      }
      else {
        // Neutral
        joystickDirection = 0;
      }
    }
  }
}

const computer: IntcodeComputer = new IntcodeComputer("day-13/input.txt");

// Free play -- no quarters needed!
computer.memory[0] = 2;

computer.runProgram();

while(true) {
  if (computer.terminated) {
    break;
  }

  processOutputs();

  // If the computer stopped running without terminating, then the program
  // is awaiting an input.
  computer.inputQueue.push(joystickDirection);
  computer.runProgram();
}

processOutputs();

console.log(score);