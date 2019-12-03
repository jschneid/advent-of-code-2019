import * as fs from 'fs';

let opcodes: number[];

function setOpcodesFromInputFile() {
  const text: string = fs.readFileSync("day-02/input.txt", "utf8");
  const opcodeStrings: string[] = text.split(",");
  opcodes = opcodeStrings.map(opcodeString => parseInt(opcodeString));
}

function performAddOperation(addendPosition1: number, addendPosition2: number, sumPosition: number) {
  const sum: number = opcodes[opcodes[addendPosition1]] + opcodes[opcodes[addendPosition2]];
  opcodes[opcodes[sumPosition]] = sum;
}

function performMultiplyOperation(multiplierPosition1: number, multiplierPosition2: number, productPosition: number) {
  const sum: number = opcodes[opcodes[multiplierPosition1]] * opcodes[opcodes[multiplierPosition2]];
  opcodes[opcodes[productPosition]] = sum;
}

function performOperation(opcodePosition: number): boolean {
  if (opcodes[opcodePosition] == 99) {
    return true;
  } else if (opcodes[opcodePosition] == 1) {
    performAddOperation(opcodePosition + 1, opcodePosition + 2, opcodePosition + 3);
  } else if (opcodes[opcodePosition] == 2) {
    performMultiplyOperation(opcodePosition + 1, opcodePosition + 2, opcodePosition + 3);
  } else {
    throw "Unexpected opcode " + opcodes[opcodePosition] + " at position " + opcodePosition;
  }
  return false;
}

function runProgram() {
  let opcodePosition: number = 0;
  while (!performOperation(opcodePosition)) {
    opcodePosition += 4;
  }  
}

function part1(): number {
  setOpcodesFromInputFile();
  opcodes[1] = 12;
  opcodes[2] = 2;
  runProgram();

  return opcodes[0];
}

console.log(part1());
