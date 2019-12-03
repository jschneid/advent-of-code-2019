import * as fs from 'fs';

let memory: number[];

function setOpcodesFromInputFile() {
  const text: string = fs.readFileSync("day-02/input.txt", "utf8");
  const opcodeStrings: string[] = text.split(",");
  memory = opcodeStrings.map(opcodeString => parseInt(opcodeString));
}

function performAddOperation(addendPosition1: number, addendPosition2: number, sumPosition: number) {
  const sum: number = memory[addendPosition1] + memory[addendPosition2];
  memory[sumPosition] = sum;
}

function performMultiplyOperation(multiplierPosition1: number, multiplierPosition2: number, productPosition: number) {
  const sum: number = memory[multiplierPosition1] * memory[multiplierPosition2];
  memory[productPosition] = sum;
}

// Performs the operation for the instruction at the instruction pointer; then returns true if the 
// program should terminate (i.e. the instruction was 99), false otherwise.
function performOperation(instructionPointer: number): boolean {
  if (memory[instructionPointer] == 99) {
    return true;
  } else if (memory[instructionPointer] == 1) {
    performAddOperation(memory[instructionPointer + 1], memory[instructionPointer + 2], memory[instructionPointer + 3]);
  } else if (memory[instructionPointer] == 2) {
    performMultiplyOperation(memory[instructionPointer + 1], memory[instructionPointer + 2], memory[instructionPointer + 3]);
  } else {
    throw "Unexpected opcode " + memory[instructionPointer] + " at position " + instructionPointer;
  }
  return false;
}

function runProgram() {
  let instructionPointer: number = 0;
  while (!performOperation(instructionPointer)) {
    instructionPointer += 4;
  }  
}

function part1(): number {
  setOpcodesFromInputFile();
  memory[1] = 12;
  memory[2] = 2;
  runProgram();

  return memory[0];
}

function part2(): number {
  // The potential solution space here should be plenty small enough for brute force to work fine.
  for (let noun: number = 0; noun <= 99; noun++) {
    for (let verb: number = 0; verb <= 99; verb++) {
      setOpcodesFromInputFile();
      memory[1] = noun;
      memory[2] = verb;
      runProgram();
      const output = memory[0];
      if (output == 19690720) {
        const solution = noun * 100 + verb;
        return solution;
      }
    }
  }

  throw 'Could not find a solution';
}

console.log(part2());