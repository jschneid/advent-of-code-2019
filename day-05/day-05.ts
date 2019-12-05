import * as fs from 'fs';

let memory: number[];
let instructionPointer: number;

class Instruction {
  parameters: number[] = [];
  parameterModes: number[] = [];
  opcode: number;
  parameterCount: number;

  constructor() {
    const instruction0 = memory[instructionPointer];
    this.opcode = instruction0 % 100;

    this.parameterCount = this.getParameterCount(this.opcode);
    for (let parameterIndex = 0; parameterIndex < this.parameterCount; parameterIndex++) {
      this.setParameterMode(instruction0, parameterIndex);
      this.parameters[parameterIndex] = memory[instructionPointer + parameterIndex + 1];
    }
  }

  setParameterMode(instruction0: number, parameterIndex: number) {
    const instruction0String = String(instruction0);
    const opcodeLength = 2;
    const parameterModeCharIndex = instruction0String.length - opcodeLength - parameterIndex - 1;

    if (parameterModeCharIndex < 0) {
      this.parameterModes[parameterIndex] = 0;
    } 
    else {
      this.parameterModes[parameterIndex] = parseInt(instruction0String[parameterModeCharIndex]);
    }
  }

  lookupParameterValue(parameterIndex: number) {
    if (this.parameterModes[parameterIndex] == 0) {
      // Position mode
      return memory[this.parameters[parameterIndex]];
    }
    else {
      // Immediate mode
      return this.parameters[parameterIndex];
    }
  }

  getParameterCount(opcode: number): number {
    switch(opcode) {
      case 99: 
        return 0;
      case 1: 
      case 2:
        return 3;
      case 3:
      case 4:
        return 1;
      default:
        throw "Unrecognized opcode: " + opcode;
    }
  }

  // Performs the operation for the instruction at the instruction pointer; then returns true if the 
  // program should terminate (i.e. the instruction was 99), false otherwise.
  perform(): boolean {
    if (this.opcode == 99) {
      return true;
    } else if (this.opcode == 1) {
      this.performAddOperation();
    } else if (this.opcode == 2) {
      this.performMultiplyOperation();
    } else {
      throw "Unexpected opcode " + this.opcode;
    }

    instructionPointer += this.parameterCount + 1;
    return false;
  }

  performAddOperation() {
    const sum: number = this.lookupParameterValue(0) + this.lookupParameterValue(1);
    memory[this.parameters[2]] = sum;
  }
  
  performMultiplyOperation() {
    const product: number = this.lookupParameterValue(0) * this.lookupParameterValue(1);
    memory[this.parameters[2]] = product;
  }
}

function setOpcodesFromInputFile() {
  const text: string = fs.readFileSync("day-02/input.txt", "utf8");
  const opcodeStrings: string[] = text.split(",");
  memory = opcodeStrings.map(opcodeString => parseInt(opcodeString));
}

function performOperation(instructionPointer: number): boolean {
  const instruction: Instruction = new Instruction();
  return instruction.perform();
}

function runProgram() {
  instructionPointer = 0;
  while (!performOperation(instructionPointer)) {
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
