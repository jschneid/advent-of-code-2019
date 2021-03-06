import { IntcodeComputer } from './IntcodeComputer';
import { truncate } from 'fs';

class Panel {
  x: number;
  y: number;
  color: number;
  painted: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.color = 0; 
    this.painted = false;
  }
}

const panels: Panel[] = [];
let x: number;
let y: number;
let facing: number; // 0 = north, 1 = east, 2 = south, 3 = west

function getPanelAt(x: number, y: number): Panel {
  let panel = panels.find(panel => panel.x === x && panel.y === y);
  if (panel) {
    return panel;
  }

  panel = new Panel(x, y);
  panels.push(panel);
  return panel;
}

function paint(color: number) {
  const panel = getPanelAt(x, y);
  panel.color = color;
  panel.painted = true;
}

function rotate(direction: number) {
  if (direction === 0) { // left
    facing--;
    if (facing < 0) {
      facing = 3;
    }
  }
  else { // right
    facing = (facing + 1) % 4;
  }
}

function advance() {
  switch (facing) {
    case 0:
      y++;
      break;
      case 1: 
      x++;
      break;
      case 2: 
      y--; 
      break;
      case 3: 
      x--;
      break;
      default:
        throw "Unrecognized facing: " + facing;
  }
}

function paintedPanelCount(): number {
  return panels.filter(panel => panel.painted).length;
}

function outputImage() {
  let minX: number = 0;
  let maxX: number = 0;
  let minY: number = 0;
  let maxY: number = 0;

  for (const panel of panels) {
    if (panel.x < minX) {
      minX = panel.x;
    }
    if (panel.x > maxX) {
      maxX = panel.x;
    }
    if (panel.y < minY) {
      minY = panel.y;
    }
    if (panel.y > maxY) {
      panel.y = y;
    }
  }

  for (let y = maxY; y >= minY; y--) {
    let line: string = "";
    for (let x = minX; x <= maxX; x++) {
      const panel = getPanelAt(x, y);
      if (panel.color == 0) {
        line += ' ';
      }
      else {
        line += '█';
      }
    }
    console.log(line);
  }
}

x = 0;
y = 0;
facing = 0;

const computer = new IntcodeComputer();

// Emergency hull painting robot starting panel
getPanelAt(0, 0).color = 1;

while(true) {
  if (computer.terminated) {
    break;
  }
  else if (computer.outputQueue.length > 1)
  {
    while (computer.outputQueue.length > 1) {
      const color = computer.outputQueue.shift();
      paint(color);
      const direction = computer.outputQueue.shift();
      rotate(direction);
      advance();
    }
    continue;
  }

  // If we didn't terminate, and there was no output, then the program
  // must be awaiting an input.
  const panel = getPanelAt(x, y);
  computer.inputQueue.push(panel.color);
  computer.runProgram();
}

console.log(outputImage());
