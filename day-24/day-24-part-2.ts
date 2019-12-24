import * as fs from 'fs';

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-24/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

class Tile {
  readonly hasBug: boolean;

  constructor(hasBug: boolean) {
    this.hasBug = hasBug;
  }
}

let tiles: Tile[][][] = [];
let minimumLevel: number = 1000;
let maximumLevel: number = 1000;
const INITIAL_LEVEL: number = 1000;

function initializeTiles() {
  const lines = getInputLinesFromFile();
  tiles[INITIAL_LEVEL] = [];
  for (let y = 0; y < 5; y++) {
    tiles[INITIAL_LEVEL][y] = [];
    for (let x = 0; x < 5; x++) {
      const hasBug: boolean = lines[y].charAt(x) === "#";
      tiles[INITIAL_LEVEL][y][x] = new Tile(hasBug);
    }
  }
}

function safeHasBug(x: number, y: number, level: number): boolean {
  if (tiles[level] && tiles[level][y] && tiles[level][y][x]) {
    return tiles[level][y][x].hasBug;
  }
  return false;
}

class Coordinate {
  readonly x: number;
  readonly y: number;
  readonly level: number;
  constructor(x: number, y: number, level: number) {
    this.x = x;
    this.y = y;
    this.level = level;
  }
}

function getAdjacentTiles(x: number, y: number, level: number): Coordinate[] {
  const adjacentTiles: Coordinate[] = [];
  
  // Tile(s) above the current one
  if (y === 0) {
    adjacentTiles.push(new Coordinate(2, 1, level - 1));
  }
  else if (y === 3 && x === 2) {
    adjacentTiles.push(new Coordinate(0, 4, level + 1));
    adjacentTiles.push(new Coordinate(1, 4, level + 1));
    adjacentTiles.push(new Coordinate(2, 4, level + 1));
    adjacentTiles.push(new Coordinate(3, 4, level + 1));
    adjacentTiles.push(new Coordinate(4, 4, level + 1));
  }
  else {
    adjacentTiles.push(new Coordinate(x, y - 1, level));
  }

  // Tile(s) to the right of the current one
  if (x === 4) {
    adjacentTiles.push(new Coordinate(3, 2, level - 1));
  }
  else if (y === 2 && x === 1) {
    adjacentTiles.push(new Coordinate(0, 0, level + 1));
    adjacentTiles.push(new Coordinate(0, 1, level + 1));
    adjacentTiles.push(new Coordinate(0, 2, level + 1));
    adjacentTiles.push(new Coordinate(0, 3, level + 1));
    adjacentTiles.push(new Coordinate(0, 4, level + 1));
  }
  else {
    adjacentTiles.push(new Coordinate(x + 1, y, level));
  }

  // Tile(s) below the current one
  if (y === 4) {
    adjacentTiles.push(new Coordinate(2, 3, level - 1));
  }
  else if (y === 1 && x === 2) {
    adjacentTiles.push(new Coordinate(0, 0, level + 1));
    adjacentTiles.push(new Coordinate(1, 0, level + 1));
    adjacentTiles.push(new Coordinate(2, 0, level + 1));
    adjacentTiles.push(new Coordinate(3, 0, level + 1));
    adjacentTiles.push(new Coordinate(4, 0, level + 1));
  }
  else {
    adjacentTiles.push(new Coordinate(x, y + 1, level));
  }

  // Tile(s) to the left of the current one
  if (x === 0) {
    adjacentTiles.push(new Coordinate(1, 2, level - 1));
  }
  else if (y === 2 && x === 1) {
    adjacentTiles.push(new Coordinate(4, 0, level + 1));
    adjacentTiles.push(new Coordinate(4, 1, level + 1));
    adjacentTiles.push(new Coordinate(4, 2, level + 1));
    adjacentTiles.push(new Coordinate(4, 3, level + 1));
    adjacentTiles.push(new Coordinate(4, 4, level + 1));
  }
  else {
    adjacentTiles.push(new Coordinate(x - 1, y, level));
  }

  return adjacentTiles;
}

function getAdjacentBugs(x: number, y: number, level: number): number {
  let adjacentBugs: number = 0;

  const adjacentTiles: Coordinate[] = getAdjacentTiles(x, y, level);

  for (const adjacentTile of getAdjacentTiles(x, y, level)) {
    if (safeHasBug(adjacentTile.x, adjacentTile.y, adjacentTile.level)) {
      adjacentBugs++;  
    }
  }

  return adjacentBugs;
}

function incrementGeneration() {
  const nextGenerationTiles: Tile[][][] = []; 
  for (let level = minimumLevel - 1; level <= maximumLevel + 1; level++) {
    nextGenerationTiles[level] = [];
    for (let y = 0; y < 5; y++) {
      nextGenerationTiles[level][y] = [];
      for (let x = 0; x < 5; x++) {
        const adjacentBugs = getAdjacentBugs(x, y, level);
        const hasBug = safeHasBug(x, y, level);
        if (hasBug && adjacentBugs !== 1) {
          nextGenerationTiles[level][y][x] = new Tile(false);
        }
        else if (!hasBug && (adjacentBugs === 1 || adjacentBugs === 2)) {
          nextGenerationTiles[level][y][x] = new Tile(true);

          if (level < minimumLevel) {
            minimumLevel = level;
          }
          else if (maximumLevel < level) {
            maximumLevel = level;
          }
        }
        else {
          nextGenerationTiles[level][y][x] = new Tile(hasBug);
        }
      }
    }
  }
  tiles = nextGenerationTiles;
}

// function debugPrintTiles() {
//   console.log("Generation " + generation + ":");
//   for (let y = 0; y < 5; y++) {
//     let line: string = "";
//     for (let x = 0; x < 5; x++) {
//       line += tiles[y][x].hasBug ? "#" : ".";
//     }
//     console.log(line);
//   }
// }

function getTotalBugCount(): number {
  let bugCount: number = 0;
  for (let level = minimumLevel; level <= maximumLevel; level++) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (safeHasBug(x, y, level)) {
          bugCount++;
        }
      }
    }
  }
  return bugCount;
}

initializeTiles();
for (let generation = 0; generation < 200; generation++) {
  console.log("Bugs after " + generation + " generations: " + getTotalBugCount());
  incrementGeneration();
}
console.log("Bugs after 200 generations: " + getTotalBugCount());
