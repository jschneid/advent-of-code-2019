import * as fs from 'fs';

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-01/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function getFuelRequirement(mass: number):number {
  let fuelRequired: number = Math.trunc(mass / 3) - 2;
  return fuelRequired;
}

// Part 1
function getTotalFuelRequirement(): number {
  let totalFuelRequired:number = 0;

  const lines = getInputLinesFromFile();
  for (const line of lines) {
    const mass = +line;
    const fuelRequired = getFuelRequirement(mass);
    totalFuelRequired += fuelRequired;
  }

  return totalFuelRequired;
}

// Part 2
function getTotalFuelRequirementIncludingAdditionalFuel() : number {
  let totalFuelRequired:number = 0;

  const lines = getInputLinesFromFile();
  for (const line of lines) {
    const mass = +line;
    let fuelRequired = getFuelRequirement(mass);
    totalFuelRequired += fuelRequired;
    
    while (true) {
      let additionalFuelRequired: number = getFuelRequirement(fuelRequired);
      if (additionalFuelRequired <= 0)
      {
        break;
      }
      totalFuelRequired += additionalFuelRequired;
      fuelRequired = additionalFuelRequired;
    }
  }

  return totalFuelRequired;
}

console.log(getTotalFuelRequirementIncludingAdditionalFuel());
