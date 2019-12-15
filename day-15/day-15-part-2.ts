import { IntcodeComputer } from './IntcodeComputer';
import { pseudoRandomBytes } from 'crypto';

class Position {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Location {
  readonly position: Position;
  readonly isOpen: boolean;
  distance: number;

  constructor(position: Position, isOpen: boolean, distance: number) {
    this.position = position;
    this.isOpen = isOpen;
    this.distance = distance;
  }
}


const map: Location[] = [];

let oxygenSystemLocation: Location = null;
let robotPosition: Position = new Position(0, 0);
const startLocation: Location = new Location(robotPosition, true, 0);
const computer: IntcodeComputer = new IntcodeComputer("day-15/input.txt");


function getLocationAt(position: Position): Location {
  const targetLocation: Location = map.find(location => location.position.x === position.x && location.position.y === position.y);
  return targetLocation;
}

function getRelativePositionAtDirection(position: Position, direction: number): Position {
  switch(direction) {
    case 1: // North
      return new Position(position.x, position.y + 1);
    case 2: // South 
      return new Position(position.x, position.y - 1);
    case 3: // West
      return new Position(position.x - 1, position.y);
    case 4: // East
      return new Position(position.x + 1, position.y);
    default: 
      throw "Unexpected direction: " + direction;
  }
}

function getReverseOfDirection(direction: number): number {
  switch(direction) {
    case 1: // North
      return 2;
    case 2: // South 
      return 1;
    case 3: // West
      return 4;
    case 4: // East
      return 3;
    default: 
      throw "Unexpected direction: " + direction;
  }
}

function exploreLocation(location: Location) {
  for (let direction = 1; direction <= 4; direction++) {
    // Skip this direction if it has already been mapped
    const newPosition: Position = getRelativePositionAtDirection(robotPosition, direction);
    let targetLocation: Location = getLocationAt(newPosition);
    if (targetLocation) {
      continue;
    }

    // Try to move to the target location
    computer.inputQueue.push(direction);
    computer.runProgram();
    
    // Get the result (read the output)
    const result: number = computer.outputQueue.shift();

    // If we succeeded, explore it
    if (result === 1 || result === 2) {
      robotPosition = newPosition;

      targetLocation = new Location(newPosition, true, location.distance + 1);
      map.push(targetLocation);

      if (result === 2) {
        oxygenSystemLocation = targetLocation;
      }

      exploreLocation(targetLocation);
      
      // Then move back to the original position
      const reverseDirection = getReverseOfDirection(direction);
      const oldPosition = getRelativePositionAtDirection(robotPosition, reverseDirection);
      computer.inputQueue.push(reverseDirection);
      computer.runProgram();
      robotPosition = oldPosition;
      computer.outputQueue.shift();
    }
    else {
      // Else, mark that location as being a wall
      targetLocation = new Location(newPosition, false, -1);
      map.push(targetLocation);
    }
  }
}

function debugPrintMap() {
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;
  for (const location of map) {
    if (location.position.x < minX) {
      minX = location.position.x;
    }
    if (location.position.x > maxX) {
      maxX = location.position.x;
    }
    if (location.position.y < minY) {
      minY = location.position.y;
    }
    if (location.position.y > maxY) {
      maxY = location.position.y;
    }
  }

  let printedMap = "";
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const location = getLocationAt(new Position(x, y));
      if (location) {
        if (oxygenSystemLocation && location.position.x === oxygenSystemLocation.position.x && location.position.y === oxygenSystemLocation.position.y) {
          printedMap += "O";
        }
        else if (location.position.x === 0 && location.position.y === 0) {
          printedMap += "S";
        }
        else if (location.isOpen) { 
          printedMap += ".";
        }
        else {
          printedMap += "█";
        }
      }
      else {
        printedMap += " ";
      }
    }
    printedMap += "\n";
  }
  console.log(printedMap);
}

// 1. Map the entire space
map.push(startLocation);
exploreLocation(startLocation);
debugPrintMap();

// 2. Find the shortest path from 0,0 to the oxygen room

// Let's see if we can "cheat" and assume that there are no loops, therefore the distance
// that we marked the oxygen location as having is the ONLY distance for that room?
// Based on how the map looks -- narrow hallways only, no 2x2 or larger open rooms, no 
// obvious loops -- maybe this will work?
console.log(oxygenSystemLocation.distance);
