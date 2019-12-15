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

  constructor(position: Position, isOpen: boolean) {
    this.position = position;
    this.isOpen = isOpen;
  }
}


const map: Location[] = [];

let oxygenSystemLocation: Location = null;
let robotPosition: Position = new Position(0, 0);
const startLocation: Location = new Location(robotPosition, true);
const computer: IntcodeComputer = new IntcodeComputer("day-15/input.txt");


function getLocationAt(position: Position): Location {
  const targetLocation: Location = map.find(location => location.position.x === position.x && location.position.y === position.y);
  return targetLocation;
}

function getRelativePositionAtDirection(position: Position, direction: number): Position {
  switch(direction) {
    case 1: // North
      return new Position(position.x, position.y + 1);
      break;
    case 2: // South 
      return new Position(position.x, position.y - 1);
      break;
    case 3: // West
      return new Position(position.x - 1, position.y);
      break;
    case 4: // East
      return new Position(position.x + 1, position.y);
      break;
    default: 
      throw "Unexpected direction: " + direction;
  }
}

function exploreLocation() {
  for (let direction = 1; direction <= 4; direction++) {
    // Skip this direction if it has already been mapped
    const newPosition: Position = getRelativePositionAtDirection(robotPosition, direction);
    const targetLocation: Location = getLocationAt(newPosition);
    if (targetLocation) {
      continue;
    }

    // Try to move to the target location
    computer.inputQueue.push(direction);
    computer.runProgram();
    
    // Get the result (read the output)


    // If we succeeded, explore it
    // Then move back to the original position

    // Else, mark that location as being a wall
    
  }
}




// 1. Map the entire space
map.push(startLocation);


// 2. Find the shortest path from 0,0 to the oxygen room

