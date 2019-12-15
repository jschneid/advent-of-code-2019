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
let oxygenRoomFound: boolean = false;
let robotPosition: Position = new Position(0, 0);
const startLocation: Location = new Location(robotPosition, true, -1);
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
    const newPosition: Position = getRelativePositionAtDirection(robotPosition, direction);
    let targetLocation: Location = getLocationAt(newPosition);

    // Skip this direction if it has already been mapped, and we haven't found the oxygen room yet
    if (targetLocation && !oxygenRoomFound) {
      continue;
    }

    // Skip this direction if we have found the oxygen room, and the target room already has a distance set
    if (targetLocation && (targetLocation.distance >= 0 || !targetLocation.isOpen) && oxygenRoomFound) {
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

      let targetLocationDistance: number;
      if (oxygenRoomFound) {
        targetLocationDistance = location.distance + 1;
      }
      else {
        targetLocationDistance = -1;
      }

      if (!targetLocation) {
        targetLocation = new Location(newPosition, true, targetLocationDistance);
        map.push(targetLocation);
      } 
      else {
        targetLocation.distance = targetLocationDistance;
      }

      // If this is the oxygen system location, we'll now start setting the distance property of each location
      // as the distance from THIS location.
      // (1) Set the distance of this room to 0.
      // (2) Set a flag to start RE-exploring locations, this time setting the distance value.
      if (result === 2) {
        targetLocation.distance = 0;
        oxygenRoomFound = true;
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

map.push(startLocation);
exploreLocation(startLocation);

// Now, the "distance" property of each location is set to the distance from there to the oxygen room.
// So, our solution is the max distance.

let maxDistance: number = 0;
for (let location of map) {
  if (location.distance > maxDistance) {
    maxDistance = location.distance;
  }
}

// Let's see if we can "cheat" and assume that there are no loops, therefore the distance
// that we marked the oxygen location as having is the ONLY distance for that room?
// Based on how the map looks -- narrow hallways only, no 2x2 or larger open rooms, no 
// obvious loops -- maybe this will work?
console.log(maxDistance);
