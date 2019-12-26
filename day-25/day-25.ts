import * as readline from 'readline';
import { IntcodeComputer } from './IntcodeComputer';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const computer: IntcodeComputer = new IntcodeComputer("day-25/input.txt");

function sendAsciiLine(line: string) {
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    computer.inputQueue.push(code);
  }
  computer.inputQueue.push(10); // Newline
}

function getAndRenderOutput(): void {
  const output: string = getAsciiOutput();
  console.log(output);
}

function getAsciiOutput(): string {
  let outputAscii: string = ""; 
  while (computer.outputQueue.length > 0) {
    const output = computer.outputQueue.shift();
    outputAscii += String.fromCharCode(output);
  }

  return outputAscii;
}

function askQuestion(): Promise<string> {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
  });

  return new Promise(resolve => rl.question("> ", ans => {
      rl.close();
      resolve(ans);
  }))
}

function getAllSafeItems() {
  computer.runProgram();
  getAndRenderOutput();

  let commands: string[] = [];
  commands.push("south");
  commands.push("west");
  commands.push("north");
  commands.push("take fuel cell");
  commands.push("west");
  commands.push("east");
  commands.push("south");
  commands.push("east");
  commands.push("north");
  commands.push("north");
  commands.push("east");
  commands.push("take candy cane");
  commands.push("south");
  commands.push("take hypercube");
  commands.push("east");
  commands.push("west");
  commands.push("north");
  commands.push("north");
  commands.push("south");
  commands.push("west");
  commands.push("north");
  commands.push("take coin");
  commands.push("east");
  commands.push("take tambourine");
  commands.push("west");
  commands.push("west");
  commands.push("take spool of cat6");
  commands.push("south");
  commands.push("north");
  commands.push("north");
  commands.push("take weather machine");
  commands.push("west");
  commands.push("take mutex");
  commands.push("west");
  for (const command of commands) {
    sendAsciiLine(command);
    computer.runProgram();
    getAndRenderOutput();
  }  
}

function bypassSecurityCheckpoint() {
  const items: string[] = [];
  items.push("spool of cat6");
  items.push("hypercube");
  items.push("weather machine");
  items.push("coin");
  items.push("candy cane");
  items.push("tambourine");
  items.push("fuel cell");
  items.push("mutex");

  const possibleItemCombinations = Math.pow(2, items.length);
  for (let i = 0; i < possibleItemCombinations; i++) {
    for (let j = 0; j < items.length; j++) {
      const itemBit = Math.pow(2, j);
      
      let command: string;
      if (i & itemBit) {
        command = "drop " + items[j];
      }
      else {
        command = "take " + items[j];
      }
      
      console.log("> " + command);
      sendAsciiLine(command);
      computer.runProgram();
      getAndRenderOutput();
    }

    sendAsciiLine("west");
    computer.runProgram();
    const output: string = getAsciiOutput();
    console.log(output);
    
    if (!output.includes("you are ejected")) {
      return;
    }
  }
}

async function run() {
  getAllSafeItems();
  bypassSecurityCheckpoint();

  // == Interactive mode ==

  // while (true) {
  //   computer.runProgram();
  //   getAndRenderOutput();

  //   let userInput = await askQuestion();
  //   sendAsciiLine(userInput);
  // }
}

run();