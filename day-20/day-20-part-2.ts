import * as fs from 'fs';

const inputLines: string[] = getInputLinesFromFile();
const map: Location[][] = new Array<Array<Location>>();
let entrance: Location;
let exit: Location;

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-20/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

class Location {
  readonly isWall: boolean;
  readonly isEmptySpace: boolean;
  readonly isOuter: boolean;
  warp: string;
  readonly x: number;
  readonly y: number;

  constructor(inputCharacter: string, x: number, y: number, warp: string, isOuter: boolean) {
    this.x = x;
    this.y = y;
    this.isOuter = isOuter;
    if (warp !== "AA" && warp !== "ZZ") {
      this.warp = warp;
    }

    this.isWall = false;

    switch(inputCharacter) {
      case "#":
        this.isWall = true;
        break;
      case " ":
        this.isEmptySpace = true;
        break;
      case ".":
        // Normal non-wall location
        break;
      default:
        // A letter; so also empty space
        this.isEmptySpace = true;
        break;
    }
  }

  toString(): string {
    if (this.isWall) {
      return "█";
    }
    else if (this.isEmptySpace) {
      return " ";
    }
    else if (this == entrance) {
      return "A";
    }
    else if (this == exit) {
      return "Z";
    }
    else if (this.warp) {
      if (this.isOuter) {
        return "U";
      }
      else {
        return "D";
      }
    }
    return ".";
  }
}

function initializeMapFromInput() {
  for (let y = 0; y < inputLines.length; y++) {
    map[y] = new Array<Location>();
    const line = inputLines[y];
    for (let x = 0; x < line.length; x++) {
      const inputCharacter = line.charAt(x);

      let warp: string = null;
      if (inputCharacter === '.') {
        warp = getWarpForLocation(x, y);
      }

      const isOuter: boolean = (x === 2 || y === 2 || x === line.length - 3 || y === inputLines.length - 3);

      map[y][x] = new Location(inputCharacter, x, y, warp, isOuter);

      if (warp === "AA") {
        entrance = map[y][x];
      }
      else if (warp === "ZZ") { 
        exit = map[y][x];
      }
    }
  }
}

function isLetter(character: string): boolean {
  return (character >= "A" && character <= "Z");
}

function getWarpForLocation(x: number, y: number): string {
  if (y >= 2 && isLetter(inputLines[y-1].charAt(x))) {
    return inputLines[y-2].charAt(x) + inputLines[y-1].charAt(x);
  }
  else if (y < inputLines.length - 2 && isLetter(inputLines[y+1].charAt(x))) {
    return inputLines[y+1].charAt(x) + inputLines[y+2].charAt(x);
  }
  else if (x >= 2 && isLetter(inputLines[y].charAt(x-1))) {
    return inputLines[y].charAt(x-2) + inputLines[y].charAt(x-1);
  }
  else if (x < inputLines[y].length - 2 && isLetter(inputLines[y].charAt(x+1))) {
    return inputLines[y].charAt(x+1) + inputLines[y].charAt(x+2);
  }
  return null;
}


function debugPrintMap() {
  let xAxis: string = " ";
  for (let i = 0; i < inputLines[0].length; i++) {
    xAxis += (i % 10);
  }
  console.log(xAxis);
  for (let y = 0; y < inputLines.length; y++) {
    let line: string = "" + (y % 10);
    for (let x = 0; x < line.length; x++) {
      if (map[y][x]) {
        line += map[y][x].toString();
      }
    }
    console.log(line);
  }
}

// North: 1
// East: 2
// South: 3
// West: 4
function getLocationInDirectionFrom(direction: number, source: Location) {
  let destinationX: number = source.x;
  let destinationY: number = source.y;

  switch (direction) {
    case 1: 
      destinationY = source.y - 1;
      break;
    case 2: 
      destinationX = source.x + 1;
      break;
    case 3:
      destinationY = source.y + 1;
      break;
    case 4:
      destinationX = source.x - 1;
      break;
    default:
      throw "Unrecognized direction: " + direction;
  }

  if (destinationX < 2 || destinationY < 2 || destinationX > map[2].length - 2 || destinationY > map.length - 2) {
    return null;
  }

  return map[destinationY][destinationX];
}

function getWarpDestination(location: Location): Location {
  // If this turns out to be slow, we could do this once for each portal location after 
  // we set up the map and cache the result, e.g. in a "target" attribute on each Location 
  // that has a warp.
  for (let y = 0; y < inputLines.length; y++) {
    for (let x = 0; x < inputLines[y].length; x++) {
      if (map[y][x] !== location && map[y][x].warp === location.warp) {
        return map[y][x];
      }
    }
  }
}

let bestSolution: number = Number.MAX_VALUE;

function exploreLocation(locationLevel: LocationLevel, pathDistances: Map<LocationLevel, number>, explorationQueue: LocationLevel[], distance: number): void { 
  if (locationLevel.location.isWall) {
    return;
  }
  else if (locationLevel.location.isEmptySpace) {
    return;
  }
  // Stop exploring if we've been to this location before on this level, and it took less moves.
  else if (pathDistances.has(locationLevel) && pathDistances.get(locationLevel) <= distance) {
    return;
  }
  else if (locationLevel.location == exit && locationLevel.level === 0) {
    if (distance < bestSolution) {
      bestSolution = distance;
      // console.log ('New best solution found: ' + bestSolution);
      throw('New best solution found: ' + bestSolution);
      return;
    }
  }

  pathDistances.set(locationLevel, distance);
  explorationQueue.push(locationLevel);
}

class LocationLevel {
  readonly location: Location;
  readonly level: number;

  constructor(location: Location, level: number) {
    this.location = location;
    this.level = level;
  }
}

const locationLevels: LocationLevel[] = [];

function getLocationLevel(location: Location, level: number): LocationLevel {
  let target: LocationLevel = locationLevels.find(ll => ll.location == location && ll.level === level);
  if (!target) {
    target = new LocationLevel(location, level);
    locationLevels.push(target);
  }
  return target;
}

function initiateBreadthFirstSearch(startLocation: Location) { 
  const startLocationLevel = getLocationLevel(startLocation, 0);
  let explorationQueue: LocationLevel[] = [startLocationLevel];
  let pathDistances = new Map<LocationLevel, number>();
  pathDistances.set(startLocationLevel, 0);

  while (explorationQueue.length > 0) {
    const currentLocationLevel: LocationLevel = explorationQueue.shift();
    const currentLocation: Location = currentLocationLevel.location;
    const currentLevel: number = currentLocationLevel.level;

    for (let direction = 1; direction <= 4; direction++) {
      const newLocation: Location = getLocationInDirectionFrom(direction, currentLocation);

      if (newLocation) {
        const newLocationDistance: number = (pathDistances.get(currentLocationLevel) + 1);
        const newLocationLevel: LocationLevel = getLocationLevel(newLocation, currentLevel);
        exploreLocation(newLocationLevel, pathDistances, explorationQueue, newLocationDistance); 
      }
    }
 
    // There's also a 5th possible "direction" in this puzzle: jumping through the warp portal!
    if (currentLocation.warp) {
      if (currentLocation.isOuter && currentLevel === 0) {
        // We can't go out a level if we're already at level 0. Don't warp.
      } 
      else {
        const newLocation: Location = getWarpDestination(currentLocation);
        const newLevel = (currentLocation.isOuter ? (currentLevel - 1) : (currentLevel + 1));
        const newLocationLevel: LocationLevel = getLocationLevel(newLocation, newLevel);
        const newLocationDistance: number = (pathDistances.get(currentLocationLevel) + 1);


        if (!(pathDistances.has(newLocationLevel) && pathDistances.get(newLocationLevel) <= newLocationDistance)) {
          console.log('Warping ' + (currentLocationLevel.location.isOuter ? 'up' : 'down') + ' to ' + newLocation.x + ',' + newLocation.y + ' level ' + newLevel + ' via ' + newLocationLevel.location.warp);
        }

        exploreLocation(newLocationLevel, pathDistances, explorationQueue, newLocationDistance); 
      }
    }
  }
}

function start() {
  initiateBreadthFirstSearch(entrance);
}

initializeMapFromInput();

debugPrintMap();
start();