import { IntcodeComputer } from './IntcodeComputer';

const points: boolean[][] = new Array<Array<boolean>>();

let previousFirstBeamX: number = 0;

const MAX_X: number = 1500;
const MAX_Y: number = 1500;

for (let y = 0; y < MAX_Y; y++) {
  points[y] = new Array<boolean>();
  let firstBeamX: number = 0;

  for (let x = previousFirstBeamX; x < MAX_X; x++) {
    // Evidently the program only supports ONE deployment of the drone,
    // so that we need to reset it each time?
    const computer: IntcodeComputer = new IntcodeComputer("day-19/input.txt");

    computer.inputQueue.push(x);
    computer.inputQueue.push(y);
    computer.runProgram();

    const isDroneBeingPulled = computer.outputQueue.shift();
    if (isDroneBeingPulled) {
      points[y][x] = true;
      if (firstBeamX === 0) {
        firstBeamX = x;
      }
    }
    else if (firstBeamX > 0) {
      // There will be no more beam points on this row
      break;
    }
  }

  previousFirstBeamX = firstBeamX;
}

function findSquareLocation() {
  for (let y = 0; y < MAX_Y; y++) {
    for (let x = 0; x < MAX_X; x++) {
      if (points[y][x] && points[y][x+99] && points[y+99][x]) {
        console.log("Found square at (" + x + "," + y + ")");
        console.log("Solution:" + (x * 10000 + y));
        return;
      }
    }
  }
  console.log("Didn't find any valid square location");
}

findSquareLocation();