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

// Unless !E and !H, jump if !C
sendAsciiLine("NOT E T");
sendAsciiLine("NOT H J");
sendAsciiLine("AND J T");
sendAsciiLine("NOT T T");
sendAsciiLine("NOT C J");
sendAsciiLine("AND T J");

// Additional jump condition: If !B 
sendAsciiLine("NOT B T");
sendAsciiLine("OR T J");


// Additional jump condition: If !A
sendAsciiLine("NOT A T");
sendAsciiLine("OR T J");

// Do NOT jump if !D 
sendAsciiLine("AND D J");

sendAsciiLine("RUN");

computer.runProgram();

let output: number = computer.outputQueue.shift();
renderOutput(output);
