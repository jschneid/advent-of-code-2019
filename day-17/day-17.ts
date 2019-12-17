import { IntcodeComputer } from './IntcodeComputer';

class Location {
  readonly isScaffold: boolean;

  constructor(isScaffold: boolean) {
    this.isScaffold = isScaffold;
  }
}

const computer: IntcodeComputer = new IntcodeComputer("day-17/ascii.txt");
const map: Location[][] = new Array<Array<Location>>();

function addLocationToMap(x: number, y: number, isScaffold: boolean) {
  const location: Location = new Location(isScaffold);
  map[y][x] = location;
}

function initializeMapFromAsciiProgram() {
  let x = 0; 
  let y = 0;

  computer.runProgram();
  while (computer.outputQueue.length > 0) {
    if (x === 0) {
      map[y] = new Array<Location>();
    }

    const outputCode: number = computer.outputQueue.shift();
    const output: string = String.fromCharCode(outputCode);

    switch(output) {
      case "#":
        addLocationToMap(x, y, true);
        x++;
        break;
      case ".":
        addLocationToMap(x, y, false);
        x++;
        break;
      case "^":
      case "v":
      case "<":
      case ">":
        // More to come here in Part 2, no doubt!
        addLocationToMap(x, y, true);
        x++;
        break;
      case "\n":
        x = 0;
        y++;
      break;
      default:
        throw "Unrecognized output character: " + output + " (" + outputCode + ")";
    }
  }
}

function debugDrawMap() {
  for (let y = 0; y < map.length; y++) {
    let mapRow = "";
    for (let x = 0; x < map[y].length; x++) {
      mapRow += map[y][x].isScaffold ? "#" : ".";
    }
    console.log(mapRow);
  }
}

initializeMapFromAsciiProgram();
debugDrawMap();
