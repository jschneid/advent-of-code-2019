import * as fs from 'fs';
import { runInThisContext } from 'vm';
import { networkInterfaces } from 'os';

// Keys: String value of the form "x,y".
// Values: A negative value represents the minimum distance of wire 1.
//   A positive number represents the combined minimum distance of wires 1 and 2.
//   (This is a hacky shortcut for tracking the presence of values for wire 1 and/or 2 
//   at the location in separate variables.)
const grid: Map<string, number> = new Map<string, number>();

let x: number;
let y: number;
let distanceAlongWire: number;

function getKey(): string {
  return x + "," + y;
}

function updateGrid(wireBit: number) {
  const key = getKey();
  if (grid.has(key)) {
    if (wireBit === 0b10) {
      const value = grid.get(key);
      if (value < 0) {
        grid.set(key, (-1 * value) + distanceAlongWire);
      }
    }
  } else {
    if (wireBit === 0b1) {
      grid.set(key, -1 * distanceAlongWire);
    }
  }
}

function performUpMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    y++;
    distanceAlongWire++;
    updateGrid(wireBit);
  }
}

function performRightMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    x++;
    distanceAlongWire++;
    updateGrid(wireBit);
  }
}

function performDownMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    y--;
    distanceAlongWire++;
    updateGrid(wireBit);
  }
}

function performLeftMove(distance: number, wireBit: number) {
  for (let i = 0; i < distance; i++) {
    x--;
    distanceAlongWire++;
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
  distanceAlongWire = 0;
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

function shortestDistanceOfLocationsWithTwoWires(): number {
  let shortestDistance = Number.MAX_SAFE_INTEGER;
  grid.forEach((distance: number, locationKey: string) => {
    if (distance < shortestDistance && distance > 0) {
      shortestDistance = distance;
    }
  });
  return shortestDistance;
}

function part2(): number {
  processWires();
  const solution = shortestDistanceOfLocationsWithTwoWires();
  return solution;
}

console.log(part2());