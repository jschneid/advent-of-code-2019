import { IntcodeComputer } from './IntcodeComputer';

let maxSignal = Number.NEGATIVE_INFINITY;

for (let a = 5; a <= 9; a++) {
  for (let b = 5; b <= 9; b++) {
    if (a === b) continue;
    for (let c = 5; c <= 9; c++) {
      if (a === c || b === c) continue;
      for (let d = 5; d <= 9; d++) {
        if (a === d || b === d || c === d) continue;
        for (let e = 5; e <= 9; e++) {
          if (a === e || b === e || c === e || d === e) continue;
          
          const amplifierA = new IntcodeComputer();
          amplifierA.inputQueue.push(a);
          const amplifierB = new IntcodeComputer();
          amplifierB.inputQueue.push(b);
          const amplifierC = new IntcodeComputer();
          amplifierC.inputQueue.push(c);
          const amplifierD = new IntcodeComputer();
          amplifierD.inputQueue.push(d);
          const amplifierE = new IntcodeComputer();
          amplifierE.inputQueue.push(e);

          let signal: number = 0;

          while (!amplifierE.terminated) {
            amplifierA.inputQueue.push(signal);
            amplifierA.runProgram();
            amplifierB.inputQueue.push(amplifierA.outputQueue.shift());
            amplifierB.runProgram();
            amplifierC.inputQueue.push(amplifierB.outputQueue.shift());
            amplifierC.runProgram();
            amplifierD.inputQueue.push(amplifierC.outputQueue.shift());
            amplifierD.runProgram();
            amplifierE.inputQueue.push(amplifierD.outputQueue.shift());
            amplifierE.runProgram();
            signal = amplifierE.outputQueue.shift();
          }

          if (signal > maxSignal) {
            maxSignal = signal; 
          }
        }
      }
    }
  }
}

console.log(maxSignal);
