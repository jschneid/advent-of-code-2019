import * as fs from 'fs';

class Location {
  readonly isWall: boolean;
  readonly door: string;
  readonly key: string;

  constructor(inputCharacter: string) {
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

  toString():string {
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

class Position {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface ItemLocation {
  [key: string]: Position;
}

const map: Location[][] = new Array<Array<Location>>();
const keys: ItemLocation = {};
const doors: ItemLocation = {};
let entrance: Position;

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-18/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function initializeMapFromInput() {
  let y = 0;

  const lines = getInputLinesFromFile();

  for (const line of lines) {
    map[y] = new Array<Location>();
    for (let x = 0; x < line.length; x++) {
      const inputCharacter = line.charAt(x);
      map[y][x] = new Location(inputCharacter);

      if (inputCharacter === "@") {
        entrance = new Position(x, y);
      }
    }
    y++;
  }
}


function debugDrawMap() {
  for (let y = 0; y < map.length; y++) {
    let mapRow = "";
    for (let x = 0; x < map[y].length; x++) {
      if (entrance.x === x && entrance.y === y) {
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
