import * as fs from 'fs';

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-24/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

class Tile {
  hasBug: boolean;
  x: number;
  y: number;

  constructor(hasBug: boolean, x: number, y: number) {
    this.hasBug = hasBug;
    this.x = x;
    this.y = y;
  }
}

let tiles: Tile[][] = [];
const biodiversityRatingsSeen: number[] = [];
let generation: number = 0;

function initializeTiles() {
  const lines = getInputLinesFromFile();
  for (let y = 0; y < 5; y++) {
    tiles[y] = [];
    for (let x = 0; x < 5; x++) {
      const hasBug: boolean = lines[y].charAt(x) === "#";
      tiles[y][x] = new Tile(hasBug, x, y);
    }
  }
}

function safeHasBug(x: number, y: number): boolean {
  if (tiles[y] && tiles[y][x]) {
    return tiles[y][x].hasBug;
  }
  return false;
}

function getAdjacentBugs(x: number, y: number): number {
  let adjacentBugs: number = 0;
  if (safeHasBug(x, y - 1)) {
    adjacentBugs++;
  }
  if (safeHasBug(x - 1, y)) {
    adjacentBugs++;
  }
  if (safeHasBug(x, y + 1)) {
    adjacentBugs++;
  }
  if (safeHasBug(x + 1, y)) {
    adjacentBugs++;
  }
  return adjacentBugs;
}

function incrementGeneration() {
  const nextGenerationTiles: Tile[][] = []; 
  for (let y = 0; y < 5; y++) {
    nextGenerationTiles[y] = [];
    for (let x = 0; x < 5; x++) {
      const adjacentBugs = getAdjacentBugs(x, y);
      if (tiles[y][x].hasBug && adjacentBugs !== 1) {
        nextGenerationTiles[y][x] = new Tile(false, x, y);
      }
      else if (!tiles[y][x].hasBug && (adjacentBugs === 1 || adjacentBugs === 2)) {
        nextGenerationTiles[y][x] = new Tile(true, x, y);
      }
      else {
        nextGenerationTiles[y][x] = new Tile(tiles[y][x].hasBug, x, y);
      }
    }
  }
  tiles = nextGenerationTiles;
  generation++;
}

function getBiodiversityRating(): number {
  let tileNumber: number = 0;
  let rating: number = 0;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (tiles[y][x].hasBug) {
        rating += Math.pow(2, tileNumber);
      }
      tileNumber++;
    }
  }
  return rating;
}

function findDuplicateGeneration(): number {

  while (true) {
    debugPrintTiles();

    const biodiversityRating: number = getBiodiversityRating();
    if (biodiversityRatingsSeen.includes(biodiversityRating)) {
      return biodiversityRating;
    }
    biodiversityRatingsSeen.push(biodiversityRating);

    incrementGeneration();
  }
}

function debugPrintTiles() {
  console.log("Generation " + generation + " with biodiversityRating " + getBiodiversityRating() + " :");
  for (let y = 0; y < 5; y++) {
    let line: string = "";
    for (let x = 0; x < 5; x++) {
      line += tiles[y][x].hasBug ? "#" : ".";
    }
    console.log(line);
  }
}

initializeTiles();
const solution: number = findDuplicateGeneration();
console.log(solution);