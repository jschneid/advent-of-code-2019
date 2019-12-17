import { IntcodeComputer } from './IntcodeComputer';

const computer: IntcodeComputer = new IntcodeComputer("day-17/ascii.txt");

function pushLine(instructionLine: string) {
  for (let i = 0; i < instructionLine.length; i++) {
    const code: number = instructionLine.charCodeAt(i);
    computer.inputQueue.push(code);
  }
  computer.inputQueue.push(10); // Newline
}

// Force the vacuum robot to wake up
computer.memory[0] = 2;

// See "day-17-map.txt" for where these values came from!
pushLine("A,B,B,C,B,C,B,C,A,A");
pushLine("L,6,R,8,L,4,R,8,L,12");
pushLine("L,12,R,10,L,4");
pushLine("L,12,L,6,L,4,L,4");
pushLine("n");

computer.runProgram();

while (computer.outputQueue.length) {
  console.log(computer.outputQueue.shift());
}
