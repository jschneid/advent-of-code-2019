import { IntcodeComputer } from './IntcodeComputer';

const network: IntcodeComputer[] = [];

function initializeComputers() {
  for (let i = 0; i < 50; i++) {
    const computer: IntcodeComputer = new IntcodeComputer("day-23/input.txt");
    
    // Assign network address 
    computer.inputQueue.push(i);

    network.push(computer);
  }
}

function send(address: number) {
  const computer: IntcodeComputer = network[address];  

  while (computer.outputQueue.length > 0) {
    const destinationAddress: number = computer.outputQueue.shift();
    const x: number = computer.outputQueue.shift();
    const y: number = computer.outputQueue.shift();

    if (destinationAddress === 255) {
      // Part 1 solution
      throw("Packet sent to destination 255, x=" + x + ", y=" + y);
    }
    else {
      network[destinationAddress].inputQueue.push(x);
      network[destinationAddress].inputQueue.push(y);
    }
  }
}

function receive(address: number) {
  const computer: IntcodeComputer = network[address];  
  // The problem says we're supposed to provide an input of -1 if there is no input
  if (computer.inputQueue.length === 0) {
    computer.inputQueue.push(-1);
  }
  computer.runProgram();
}

function runComputer(address: number) {
  send(address);
  receive(address);  
}

function runComputers() {
  while(true) {
    for (let i = 0; i < 50; i++) {
      runComputer(i);
    }
  }
}

initializeComputers();
runComputers();