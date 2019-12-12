export {};

class Moon {
  positions: number[];
  velocities: number[];

  constructor(x: number, y: number, z: number) {
    this.positions = [];
    this.positions[0] = x;
    this.positions[1] = y;
    this.positions[2] = z;
    this.velocities = [];
    this.velocities[0] = 0;
    this.velocities[1] = 0;
    this.velocities[2] = 0;
  }
}

const moons: Moon[] = [];

function applyGravity() {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      applyGravityForMoons(moons[i], moons[j]);
    }
  }
}

function applyGravityForMoons(a: Moon, b: Moon) {
  for (let dimension = 0; dimension <= 2; dimension++) {
    if (a.positions[dimension] < b.positions[dimension]) {
      a.velocities[dimension]++;
      b.velocities[dimension]--;
    } 
    else if (b.positions[dimension] < a.positions[dimension]) {
      b.velocities[dimension]++;
      a.velocities[dimension]--;
    } 
  }
}

function applyVelocity() {
  for (let i = 0; i < moons.length; i++) {
    for (let dimension = 0; dimension <= 2; dimension++) {
      moons[i].positions[dimension] += moons[i].velocities[dimension];      
    }
  }
}

function potentialEnergy(moon: Moon): number {
  let energy = 0;
  for (let dimension = 0; dimension <= 2; dimension++) {
    energy += Math.abs(moon.positions[dimension]);
  }
  return energy;
}

function kineticEnergy(moon: Moon): number {
  let energy = 0;
  for (let dimension = 0; dimension <= 2; dimension++) {
    energy += Math.abs(moon.velocities[dimension]);
  }
  return energy;
}

function totalMoonEnergy(moon: Moon): number {
  return potentialEnergy(moon) * kineticEnergy(moon);
}

function totalSystemEnergy(): number {
  let totalEnergy: number = 0;
  for (let i = 0; i < moons.length; i++) {
    totalEnergy += totalMoonEnergy(moons[i]);
  }
  return totalEnergy;
}

function initializeMoons() {
  // My puzzle input:
  // <x=1, y=-4, z=3>
  // <x=-14, y=9, z=-4>
  // <x=-4, y=-6, z=7>
  // <x=6, y=-9, z=-11>
  
  moons.push(new Moon(1, -4, 3));
  moons.push(new Moon(-14, 9, -4));
  moons.push(new Moon(-4, -6, 7));
  moons.push(new Moon(6, -9, -11));
}

function runSimulation1000Steps() {
  for (let step = 0; step < 1000; step++) {
    applyGravity();
    applyVelocity();
  }
}

initializeMoons();
runSimulation1000Steps();
console.log(totalSystemEnergy());