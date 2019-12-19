import * as fs from 'fs';

class Location {
  readonly isWall: boolean;
  readonly door: string;
  readonly key: string;
  readonly x: number;
  readonly y: number;

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
let entrances: Location[] = [];
let keyCount: number;

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-18/input-part-2.txt", "utf8");
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
        entrances.push(map[y][x]);
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
  const newKeysAcquired: string = baseSolution.keysAcquired + key;
  const newSolution: Solution = new Solution(newKeysAcquired, (baseSolution.moves + distance));

  // Reject this solution if we already have a solution with this same set of keys
  // (disregarding order, except that the final location is the same) and equal or fewer moves.
  for (let solution of solutions) {
    if (stringsAreEqualIgnoringOrderExceptFinalCharacter(solution.keysAcquired, newKeysAcquired)) {
      if (solution.moves <= newSolution.moves) {
        return null;
      }
      else {
        // Could add another optimization here:
        // The existing solution has more moves; discard it, and halt its processing
      }
    }
  }
  
  solutions.push(newSolution);
  return newSolution;
}

function stringsAreEqualIgnoringOrderExceptFinalCharacter(firstStr: string, secondStr: string): boolean {
  if (firstStr.length !== secondStr.length) {
    return false;
  }

  if (firstStr.charAt(firstStr.length - 1) !== secondStr.charAt(secondStr.length - 1)) {
    return false;
  }

  let first: string[] = firstStr.split('').sort();
  let second: string[] = secondStr.split('').sort();
  for (let i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) {
      return false;
    }
  }
  return true;
}

function exploreLocation(location: Location, visitedLocations: Set<Location>, solution: Solution, explorationQueue: Location[], distance: number, startLocations: Location[], bot: number): void { 
  if (location.isWall) {
    return;
  }
  else if (visitedLocations.has(location)) {
    return;
  }
  else if (location.key) {
    if (!solution.keysAcquired.includes(location.key)) {

      const newSolution = addNewSolution(solution, location.key, distance);

      if (newSolution && newSolution.keysAcquired.length < keyCount) {
        const updatedLocations: Location[] = [];
        for (let i = 0; i < 4; i++) {
          if (i === bot) {
            updatedLocations.push(location);
          }
          else {
            updatedLocations.push(startLocations[i]);
          }
        }
        initiateBreadthFirstSearch(updatedLocations, newSolution);
      }
    
      return;
    }
  }
  else if (location.door) {
    if (!solution.keysAcquired.includes(location.door.toLowerCase())) {
      return;
    }
  }

  explorationQueue.push(location);
}

function initiateBreadthFirstSearch(startLocations: Location[], solution: Solution) { 
  for (let bot = 0; bot < 4; bot++) {

    let visitedLocations = new Set<Location>([startLocations[bot]]);
    let distances = new Map<Location, number>();
    distances.set(startLocations[bot], 0);
    let explorationQueue: Location[] = [startLocations[bot]];

    while (explorationQueue.length > 0) {
      const activeBotCurrentLocation: Location = explorationQueue.shift();
      visitedLocations.add(activeBotCurrentLocation);
      
      for (let direction = 1; direction <= 4; direction++) {
        const activeBotNewLocation = getLocationInDirectionFrom(direction, activeBotCurrentLocation);
        const activeBotNewLocationDistance: number = (distances.get(activeBotCurrentLocation) + 1);
        distances.set(activeBotNewLocation, activeBotNewLocationDistance);
        exploreLocation(activeBotNewLocation, visitedLocations, solution, explorationQueue, activeBotNewLocationDistance, startLocations, bot); 
      }
    }
  }
}

class Solution {
  readonly keysAcquired: string; 
  readonly moves: number;

  constructor(keysAcquired: string, moves: number) {
    this.keysAcquired = keysAcquired;
    this.moves = moves;
  }
}

const solutions: Solution[] = [];

function start() {
  const emptySolution = new Solution("", 0);

  initiateBreadthFirstSearch(entrances, emptySolution);
}

function debugDrawMap() {
  for (let y = 0; y < map.length; y++) {
    let mapRow = "";
    for (let x = 0; x < map[y].length; x++) {
      if (entrances.includes(map[y][x])) {
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

for (let solution of solutions.filter(s => s.keysAcquired.length === keyCount)) {
  console.log(solution.moves + " " + solution.keysAcquired) ;
}
