import * as fs from 'fs';

class Location {
  readonly isWall: boolean;
  readonly door: string;
  readonly key: string;
  readonly x: number;
  readonly y: number;
  distance: number;

  constructor(inputCharacter: string, x: number, y: number) {
    this.x = x;
    this.y = y;

    this.isWall = false;

    switch(inputCharacter) {
      case "#":
        this.isWall = true;
        break;
      case ".":
      case "@":
        // Normal non-wall location
        break;
      default:
        // It's either a key or a door
        if (inputCharacter === inputCharacter.toLowerCase()) {
          this.key = inputCharacter;
        }
        else {
          this.door = inputCharacter;
        }
    }
  }

  toString(): string {
    if (this.isWall) {
      return "█";
    }
    else if (this.door) {
      return this.door;
    }
    else if (this.key) {
      return this.key;
    }
    return ".";
  }
}

interface ItemLocation {
  [key: string]: Position;
}

const map: Location[][] = new Array<Array<Location>>();
let entrance: Location;
let keyCount: number;

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-18/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function initializeMapFromInput() {
  let y = 0;
  keyCount = 0;

  const lines = getInputLinesFromFile();

  for (const line of lines) {
    map[y] = new Array<Location>();
    for (let x = 0; x < line.length; x++) {
      const inputCharacter = line.charAt(x);
      map[y][x] = new Location(inputCharacter, x, y);

      if (inputCharacter === "@") {
        entrance = map[y][x];
      }

      if (inputCharacter >= 'a' && inputCharacter <= 'z') {
        keyCount++;
      }

    }
    y++;
  }
}

class Destination {
  key: string;
  distance: number;

  constructor(key: string, distance: number) {
    this.key = key;
    this.distance = distance;
  }
}


// North: 1
// East: 2
// South: 3
// West: 4
function getLocationInDirectionFrom(direction: number, source: Location) {
  switch (direction) {
    case 1: return map[source.y - 1][source.x]; break;
    case 2: return map[source.y][source.x + 1]; break;
    case 3: return map[source.y + 1][source.x]; break;
    case 4: return map[source.y][source.x - 1]; break;
    default:
      throw "Unrecognized direction: " + direction;
  }
}

function addNewSolution(baseSolution: Solution, key: string, distance: number): Solution {

  console.log("Found a solution. New key: " + key + " distance: " + distance + " added to existing keys: " + debugOutputKeys(baseSolution.keysAcquired) + " moves: " + baseSolution.moves );

  const newKeysAcquired: Set<string> = new Set<string>(baseSolution.keysAcquired).add(key);
  const newSolution: Solution = new Solution(Array.from(newKeysAcquired), (baseSolution.moves + distance));

  console.log("The new complete set of keys is " + debugOutputKeys(newSolution.keysAcquired) + " with size " + newSolution.keysAcquired.size);
  // console.log("The new complete set of keys is " + debugOutputKeys(newKeysAcquired) + " with size " + newKeysAcquired.size);

  // TODO: Reject this solution if we already have a solution with this same set of keys
  // (disregarding order) and equal or fewer moves.
  // If we have a solution with the same set of keys but MORE moves, discard that one?
  // (And abort active processing of it?)
  
  solutions.push(newSolution);
  return newSolution;
}

function exploreLocation(location: Location, visitedLocations: Set<Location>, solution: Solution, explorationQueue: Location[]): void { 
  if (location.isWall) {
    return;
  }
  else if (visitedLocations.has(location)) {
    return;
  }
  else if (location.key) {
    if (!solution.keysAcquired.has(location.key)) {
      const newSolution = addNewSolution(solution, location.key, location.distance);

      if (newSolution.keysAcquired.size < keyCount) {

        console.log(newSolution.keysAcquired.size + " < " + keyCount + " so kicking off a new search");

        initiateBreadthFirstSearch(location, newSolution);
      }
    
      return;
    }
  }
  else if (location.door) {
    if (!solution.keysAcquired.has(location.door.toLowerCase())) {
      return;
    }
  }

  explorationQueue.push(location);
}



function initiateBreadthFirstSearch(startLocation: Location, solution: Solution) { 
  let visitedLocations = new Set<Location>([startLocation]);
  let explorationQueue: Location[] = [startLocation];
  startLocation.distance = 0;

  while (explorationQueue.length > 0) {
    const currentLocation: Location = explorationQueue.shift();
    visitedLocations.add(currentLocation);
    
    for (let direction = 1; direction <= 4; direction++) {
      const newLocation = getLocationInDirectionFrom(direction, currentLocation);
      newLocation.distance = currentLocation.distance + 1;
      exploreLocation(newLocation, visitedLocations, solution, explorationQueue); //gettableKeys, distance);

    }
  }
}

function debugOutputKeys(keys: Set<string>): string {
  let output = "";
  for (let key of Array.from(keys)) {
    output += key;
  }
  return output;
}


class Solution {
  keysAcquired: Set<string>; 
  moves: number;

  constructor(keysAcquired: string[], moves: number) {
    this.keysAcquired = new Set<string>(keysAcquired);
    this.moves = moves;
  }
}

const solutions: Solution[] = [];
  

function start() {
  const emptySolution = new Solution([], 0);

  initiateBreadthFirstSearch(entrance, emptySolution);



}

function debugDrawMap() {
  for (let y = 0; y < map.length; y++) {
    let mapRow = "";
    for (let x = 0; x < map[y].length; x++) {
      if (entrance === map[y][x]) {
        mapRow += "@";
      }
      else {
        mapRow += map[y][x].toString();
      }
    }
    console.log(mapRow);
  }
}

initializeMapFromInput();
debugDrawMap();
console.log (keyCount + " keys");

start();

for (let solution of solutions.filter(s => s.keysAcquired.size === keyCount)) {
  console.log('' + solution.moves);
}

// TODO NEXT: Debug the current output. It's finding an 84 step solution but the real solution is 86
