import { IntcodeComputer } from './IntcodeComputer';

let maxSignal = Number.NEGATIVE_INFINITY;

for (let a = 0; a <= 4; a++) {
  for (let b = 0; b <= 4; b++) {
    if (a === b) continue;
    for (let c = 0; c <= 4; c++) {
      if (a === c || b === c) continue;
      for (let d = 0; d <= 4; d++) {
        if (a === d || b === d || c === d) continue;
        for (let e = 0; e <= 4; e++) {
          if (a === e || b === e || c === e || d === e) continue;
          
          const phaseSettings: number[] = [a, b, c, d, e];
          let signal = 0;
          for (let i = 0; i < 5; i++) {
            const amplifier = new IntcodeComputer();
            amplifier.inputQueue.push(phaseSettings[i]);
            amplifier.inputQueue.push(signal);
            amplifier.runProgram();
            signal = amplifier.outputQueue.pop();
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
