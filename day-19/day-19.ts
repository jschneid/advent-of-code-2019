import { IntcodeComputer } from './IntcodeComputer';

let numberOfPointsAffectedByTractorBeam = 0;

for (let y = 0; y < 50; y++) {
  for (let x = 0; x < 50; x++) {
    // Evidently the program only supports ONE deployment of the drone,
    // so that we need to reset it each time?
    const computer: IntcodeComputer = new IntcodeComputer("day-19/input.txt");

    computer.inputQueue.push(x);
    computer.inputQueue.push(y);
    computer.runProgram();

    const isDroneBeingPulled = computer.outputQueue.shift();
    numberOfPointsAffectedByTractorBeam += isDroneBeingPulled;
  }
}

console.log(numberOfPointsAffectedByTractorBeam);