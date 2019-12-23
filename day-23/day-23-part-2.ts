import { IntcodeComputer } from './IntcodeComputer';

const network: IntcodeComputer[] = [];
let natLastPacketReceivedX: number = -1;
let natLastPacketReceivedY: number = -2;
let natLastPacketDeliveredY: number = -3;

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
      natLastPacketReceivedX = x;
      natLastPacketReceivedY = y;
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
  let idleDuration: number = 0;
  while(true) {
    for (let i = 0; i < 50; i++) {
      runComputer(i);
    }

    let allPacketQueuesEmpty: boolean = true;
    for (let i = 0; i < 50; i++) {
      if (network[i].inputQueue.length > 0) {
        allPacketQueuesEmpty = false;
      }
    }
    if (allPacketQueuesEmpty) {
      idleDuration++;
    } 
    else {
      idleDuration = 0;
    }
    if (idleDuration > 100) {
      console.log("All nodes idle for 100 rounds. Pushing NAT packet to node 0: " + natLastPacketReceivedX + ", " + natLastPacketReceivedY);

      if (natLastPacketDeliveredY === natLastPacketReceivedY) {
        console.log("Sending packet Y twice in a row from NAT: " + natLastPacketDeliveredY);
        return;
      }

      network[0].inputQueue.push(natLastPacketReceivedX);
      network[0].inputQueue.push(natLastPacketReceivedY);
      natLastPacketDeliveredY = natLastPacketReceivedY;
      idleDuration = 0;
    }
  }
}

initializeComputers();
runComputers();