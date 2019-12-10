import { IntcodeComputer } from './IntcodeComputer';

const computer = new IntcodeComputer();
computer.inputQueue.push(1);
computer.runProgram();

const outputQueueLength = computer.outputQueue.length;
for (let i = 0; i < outputQueueLength; i++) {
  const output = computer.outputQueue.shift()
  console.log(output);
}
