import * as fs from 'fs';
import { runInThisContext } from 'vm';
import { networkInterfaces } from 'os';

// Keys: String value of the form "x,y".
// Values: A "flags" integer, where the 0b0001 bit being set means the first wire is present,
// the 0b0010 bit being set means the second wire is present, etc.
const grid: Map<string, number> = new Map<string, number>();

let x: number;
let y: number;

function getKey(): string {
  return x + "," + y;
}

function updateGrid(wireBit: number) {
  const key = getKey();
  if (grid.has(key)) {
    const existingWires: number = grid.get(key);
    const newWires = existingWires | wireBit;
    grid.set(key, newWires);
  } else {
    grid.set(key, wireBit);
  }
}

function performUpMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    y++;
    updateGrid(wireBit);
  }
}

function performRightMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    x++;
    updateGrid(wireBit);
  }
}

function performDownMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    y--;
    updateGrid(wireBit);
  }
}

function performLeftMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    x--;
    updateGrid(wireBit);
  }
}

function processPathSegment(segment: string, wireBit: number) {
  const direction = segment.charAt(0);
  const distanceString = segment.substring(1);
  const distance = parseInt(distanceString);

  if (direction === 'U') {
    performUpMove(distance, wireBit);
  } else if (direction === 'R') {
    performRightMove(distance, wireBit);
  } else if (direction === 'D') {
    performDownMove(distance, wireBit);
  } else if (direction === 'L') {
    performLeftMove(distance, wireBit);
  } else {
    throw "Unexpected direction value: " + direction;
  }
}

function processPathSegments(segments: string[], wireBit: number) {
  x = 0;
  y = 0;
  for (const segment of segments) {
    processPathSegment(segment, wireBit);
  }
}

function getInstructionsFromInputFile(): string[] {
  const text: string = fs.readFileSync("day-03/input.txt", "utf8");
  const instructions: string[] = text.split("\n");
  return instructions;
}

function processWires() {
  const instructions: string[] = getInstructionsFromInputFile();
  let wireBit: number = 0b1;
  for (const wireInstructions of instructions) {
    const splitWireInstructions: string[] = wireInstructions.split(",");
    processPathSegments(splitWireInstructions, wireBit);
    wireBit = wireBit << 1;
  }
}

function manhattanDistance(key: string): number {
  const coordinates: string[] = key.split(",");
  const x: number = parseInt(coordinates[0]);
  const y: number = parseInt(coordinates[1]);
  const distance = Math.abs(x) + Math.abs(y);
  return distance;
}

function shortestDistanceOfLocationsWithTwoWires(): number {
  let shortestDistance = Number.MAX_SAFE_INTEGER;
  grid.forEach((wires: number, locationKey: string) => {
    if (wires === 0b11) {
      const distance = manhattanDistance(locationKey);
      if (distance < shortestDistance) {
        shortestDistance = distance;
      }
    }
  });
  return shortestDistance;
}

function part1(): number {
  processWires();
  const solution = shortestDistanceOfLocationsWithTwoWires();
  return solution;
}

console.log(part1());