import * as fs from 'fs';

class Instruction {
  parameters: number[] = [];
  parameterModes: number[] = [];
  opcode: number;
  parameterCount: number;

  setParameterMode(instruction0: number, parameterIndex: number) {
    const instruction0String = String(instruction0);
    const OPCODE_LENGTH = 2;
    const parameterModeCharIndex = instruction0String.length - OPCODE_LENGTH - parameterIndex - 1;

    if (parameterModeCharIndex < 0) {
      this.parameterModes[parameterIndex] = 0;
    } 
    else {
      this.parameterModes[parameterIndex] = parseInt(instruction0String[parameterModeCharIndex]);
    }
  }
}

export class IntcodeComputer {
  memory: number[];
  instructionPointer: number;
  inputQueue: number[];
  outputQueue: number[];
  terminated: boolean;
  relativeBase: number;

  constructor(inputFile: string) {
    this.inputQueue = [];
    this.outputQueue = [];
    this.setOpcodesFromInputFile(inputFile);
    this.instructionPointer = 0;
    this.terminated = false;
    this.relativeBase = 0;
  }

  setupInstruction(): Instruction {
    const instruction: Instruction = new Instruction();

    const instruction0 = this.readMemory(this.instructionPointer);
    instruction.opcode = instruction0 % 100;
    instruction.parameterCount = this.getParameterCount(instruction.opcode);
    for (let parameterIndex = 0; parameterIndex < instruction.parameterCount; parameterIndex++) {
      instruction.setParameterMode(instruction0, parameterIndex);
      instruction.parameters[parameterIndex] = this.readMemory(this.instructionPointer + parameterIndex + 1);
    }

    return instruction;
  }

  readMemory(location: number): number {
    let value: number = this.memory[location];
    if (!value) {
      value = 0;
    }
    return value;
  }

  lookupParameterValue(instruction: Instruction, parameterIndex: number):number {
    if (instruction.parameterModes[parameterIndex] == 0) {
      // Position mode
      return this.readMemory(this.lookupParameterMemoryLocation(instruction, parameterIndex));
    }
    else if (instruction.parameterModes[parameterIndex] == 1) {
      // Immediate mode
      return instruction.parameters[parameterIndex];
    } 
    else if (instruction.parameterModes[parameterIndex] == 2) {
      // Relative mode
      const adjustedMemoryLocation = this.lookupParameterMemoryLocation(instruction, parameterIndex);
      return this.readMemory(adjustedMemoryLocation);
    } 
    else {
      throw 'Unrecognized parameter mode: ' + instruction.parameterModes[parameterIndex];
    }
  }

  lookupParameterMemoryLocation(instruction: Instruction, parameterIndex: number):number {
    if (instruction.parameterModes[parameterIndex] == 0) {
      // Position mode
      return instruction.parameters[parameterIndex];
    }
    else if (instruction.parameterModes[parameterIndex] == 1) {
      // Immediate mode
      throw("Unexpected immediate mode while calculating memory location");
    } 
    else if (instruction.parameterModes[parameterIndex] == 2) {
      // Relative mode
      const adjustedMemoryLocation = instruction.parameters[parameterIndex] + this.relativeBase;
      return adjustedMemoryLocation;
    } 
    else {
      throw 'Unrecognized parameter mode: ' + instruction.parameterModes[parameterIndex];
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
      case 9:
        return 1;
      case 5:
      case 6:
        return 2;
      default:
        throw "Unrecognized opcode: " + opcode;
    }
  }

  // Performs the operation for the instruction at the instruction pointer; then returns true if the 
  // program should stop executing, false otherwise.
  perform(instruction: Instruction): boolean {
    const initialInstructionPointerValue = this.instructionPointer;

    switch(instruction.opcode) {
      case 99:
        this.terminated = true;
        return true;
      case 1:
        this.performAddOperation(instruction);
        break;
      case 2:
        this.performMultiplyOperation(instruction);
        break;
      case 3: 
        const halt: boolean = this.performInputOperation(instruction);
        if (halt) {
          return true;
        }
        break;
      case 4: 
        this.performOutputOperation(instruction);
        break;
      case 5: 
        this.performJumpIfTrueOperation(instruction);
        break;
      case 6:
        this.performJumpIfFalseOperation(instruction);
        break;
      case 7:
        this.performLessThanOperation(instruction);
        break;
      case 8: 
        this.performEqualsOperation(instruction);
        break;
      case 9:
        this.performAdjustRelativeBaseOperation(instruction);
        break;
      default: 
        throw "Unexpected opcode " + instruction.opcode;
    }

    if (this.instructionPointer === initialInstructionPointerValue) {
      this.instructionPointer += instruction.parameterCount + 1;
    }

    return false;
  }

  performAddOperation(instruction: Instruction) {
    const sum: number = this.lookupParameterValue(instruction, 0) + this.lookupParameterValue(instruction, 1);
    const targetLocation = this.lookupParameterMemoryLocation(instruction, 2);
    this.memory[targetLocation] = sum;
  }
  
  performMultiplyOperation(instruction: Instruction) {
    const product: number = this.lookupParameterValue(instruction, 0) * this.lookupParameterValue(instruction, 1);
    const targetLocation = this.lookupParameterMemoryLocation(instruction, 2);
    this.memory[targetLocation] = product;
  }

  performInputOperation(instruction: Instruction): boolean {
    if (this.inputQueue.length >= 1) {
      const targetLocation = this.lookupParameterMemoryLocation(instruction, 0);
      this.memory[targetLocation] = this.inputQueue.shift();
      return false;
    }
    else {
      // Let's halt for now since there are no more inputs for us to process yet.
      return true;
    }
  }

  performOutputOperation(instruction: Instruction) {
    const outputValue = this.lookupParameterValue(instruction, 0);
    this.outputQueue.push(outputValue);
  }

  performJumpIfTrueOperation(instruction: Instruction) {
    if (this.lookupParameterValue(instruction, 0) !== 0) {
      this.instructionPointer = this.lookupParameterValue(instruction, 1);
    }
  }

  performJumpIfFalseOperation(instruction: Instruction) {
    if (this.lookupParameterValue(instruction, 0) === 0) {
      this.instructionPointer = this.lookupParameterValue(instruction, 1);
    }
  }

  performLessThanOperation(instruction: Instruction) {
    const targetLocation = this.lookupParameterMemoryLocation(instruction, 2);
    if (this.lookupParameterValue(instruction, 0) < this.lookupParameterValue(instruction, 1)) {
      this.memory[targetLocation] = 1;
    } else {
      this.memory[targetLocation] = 0;
    }
  }

  performEqualsOperation(instruction: Instruction) {
    const targetLocation = this.lookupParameterMemoryLocation(instruction, 2);
    if (this.lookupParameterValue(instruction, 0) === this.lookupParameterValue(instruction, 1)) {
      this.memory[targetLocation] = 1;
    } else {
      this.memory[targetLocation] = 0;
    }
  }

  performAdjustRelativeBaseOperation(instruction: Instruction) {
    this.relativeBase += this.lookupParameterValue(instruction, 0);
  }

  setOpcodesFromInputFile(file: string) {
    const text: string = fs.readFileSync(file, "utf8");
    const opcodeStrings: string[] = text.split(",");
    this.memory = opcodeStrings.map(opcodeString => parseInt(opcodeString));
  }

  performOperation(instructionPointer: number): boolean {
    const instruction: Instruction = this.setupInstruction();
    return this.perform(instruction);
  }

  runProgram() {
    while (!this.performOperation(this.instructionPointer)) {
    }  
  }
}
