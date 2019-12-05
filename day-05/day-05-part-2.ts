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
      case 7:
      case 8:
        return 3;
      case 3:
      case 4:
        return 1;
      case 5:
      case 6:
        return 2;
      default:
        throw "Unrecognized opcode: " + opcode;
    }
  }

  // Performs the operation for the instruction at the instruction pointer; then returns true if the 
  // program should terminate (i.e. the instruction was 99), false otherwise.
  perform(): boolean {
    const initialInstructionPointerValue = instructionPointer;

    switch(this.opcode) {
      case 99:
        return true;
      case 1:
        this.performAddOperation();
        break;
      case 2:
        this.performMultiplyOperation();
        break;
      case 3: 
        this.performInputOperation();
        break;
      case 4: 
        this.performOutputOperation();
        break;
      case 5: 
        this.performJumpIfTrueOperation();
        break;
      case 6:
        this.performJumpIfFalseOperation();
        break;
      case 7:
        this.performLessThanOperation();
        break;
      case 8: 
        this.performEqualsOperation();
        break;
      default: 
        throw "Unexpected opcode " + this.opcode;
    }

    if (instructionPointer === initialInstructionPointerValue) {
      instructionPointer += this.parameterCount + 1;
    }

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

  performInputOperation() {
    const HARD_CODED_INPUT: number = 5;
    memory[this.parameters[0]] = HARD_CODED_INPUT;
  }

  performOutputOperation() {
    console.log("Output: " + this.lookupParameterValue(0));
  }

  performJumpIfTrueOperation() {
    if (this.lookupParameterValue(0) !== 0) {
      instructionPointer = this.lookupParameterValue(1);
    }
  }

  performJumpIfFalseOperation() {
    if (this.lookupParameterValue(0) === 0) {
      instructionPointer = this.lookupParameterValue(1);
    }
  }

  performLessThanOperation() {
    if (this.lookupParameterValue(0) < this.lookupParameterValue(1)) {
      memory[this.parameters[2]] = 1;
    } else {
      memory[this.parameters[2]] = 0;
    }
  }

  performEqualsOperation() {
    if (this.lookupParameterValue(0) === this.lookupParameterValue(1)) {
      memory[this.parameters[2]] = 1;
    } else {
      memory[this.parameters[2]] = 0;
    }
  }
}

function setOpcodesFromInputFile() {
  const text: string = fs.readFileSync("day-05/input.txt", "utf8");
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


setOpcodesFromInputFile();
runProgram();