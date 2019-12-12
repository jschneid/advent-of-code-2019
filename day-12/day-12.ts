class Moon {
  // Position
  x: number;
  y: number;
  z: number;

  // Velocity
  vx: number;
  vy: number;
  vz: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
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
  if (a.x < b.x) {
    a.vx++;
    b.vx--;
  } 
  else if (b.x < a.x) {
    b.vx++;
    a.vx--;
  }
  if (a.y < b.y) {
    a.vy++;
    b.vy--;
  } 
  else if (b.y < a.y) {
    b.vy++;
    a.vy--;
  }
  if (a.z < b.z) {
    a.vz++;
    b.vz--;
  } 
  else if (b.z < a.z) {
    b.vz++;
    a.vz--;
  }
}

function applyVelocity() {
  for (let i = 0; i < moons.length; i++) {
    moons[i].x += moons[i].vx;
    moons[i].y += moons[i].vy;
    moons[i].z += moons[i].vz;
  }
}

function potentialEnergy(moon: Moon): number {
  return Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
}

function kineticEnergy(moon: Moon): number {
  return Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz);
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