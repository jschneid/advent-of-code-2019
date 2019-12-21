import { IntcodeComputer } from './IntcodeComputer';

function sendAsciiLine(line: string) {
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    computer.inputQueue.push(code);
  }
  computer.inputQueue.push(10); // Newline
}

function renderOutput(output: number) {
  let outputAscii: string = "";      
  let hullDamage = -1;
  while (computer.outputQueue.length > 0) {
    outputAscii += String.fromCharCode(output);
    output = computer.outputQueue.shift();
  }
  console.log(outputAscii);

  if (output > 255) {
    hullDamage = output;
  }

  console.log("Hull damage: " + hullDamage);
}

const computer: IntcodeComputer = new IntcodeComputer("day-21/input.txt");

sendAsciiLine("NOT A J");
sendAsciiLine("NOT B T");
sendAsciiLine("OR T J");
sendAsciiLine("NOT C T");
sendAsciiLine("AND D T");
sendAsciiLine("OR T J");
sendAsciiLine("AND D J");
sendAsciiLine("WALK");

computer.runProgram();

let output: number = computer.outputQueue.shift();
renderOutput(output);
