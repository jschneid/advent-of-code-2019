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
  warp: string;
  readonly x: number;
  readonly y: number;

  constructor(inputCharacter: string, x: number, y: number, warp: string) {
    this.x = x;
    this.y = y;
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
      return "*";
    }
    return ".";
  }
}

function initializeMapFromInput() {
  for (let y = 2; y < inputLines.length - 2; y++) {
    map[y] = new Array<Location>();
    const line = inputLines[y];
    for (let x = 2; x < line.length - 2; x++) {
      const inputCharacter = line.charAt(x);
      const warp: string = getWarpForLocation(x, y);

      map[y][x] = new Location(inputCharacter, x, y, warp);

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
  if (isLetter(inputLines[y-1].charAt(x))) {
    return inputLines[y-2].charAt(x) + inputLines[y-1].charAt(x);
  }
  else if (isLetter(inputLines[y+1].charAt(x))) {
    return inputLines[y+1].charAt(x) + inputLines[y+2].charAt(x);
  }
  else if (isLetter(inputLines[y].charAt(x-1))) {
    return inputLines[y].charAt(x-2) + inputLines[y].charAt(x-1);
  }
  else if (isLetter(inputLines[y].charAt(x+1))) {
    return inputLines[y].charAt(x+1) + inputLines[y].charAt(x+2);
  }
  return null;
}


function debugPrintMap() {
  for (let y = 2; y < inputLines.length-2; y++) {
    let line: string = "";
    for (let x = 2; x < inputLines.length-2; x++) {
      line += map[y][x].toString();
    }
    console.log(line);
  }
}

initializeMapFromInput();
debugPrintMap();