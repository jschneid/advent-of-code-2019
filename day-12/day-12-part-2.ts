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

function applyGravity(dimension: number) {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      applyGravityForMoons(moons[i], moons[j], dimension);
    }
  }
}

function applyGravityForMoons(a: Moon, b: Moon, dimension: number) {
  if (a.positions[dimension] < b.positions[dimension]) {
    a.velocities[dimension]++;
    b.velocities[dimension]--;
  } 
  else if (b.positions[dimension] < a.positions[dimension]) {
    b.velocities[dimension]++;
    a.velocities[dimension]--;
  } 
}

function applyVelocity(dimension: number) {
  for (let i = 0; i < moons.length; i++) {
    moons[i].positions[dimension] += moons[i].velocities[dimension];      
  }
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

function areWeBackAtInitialState(initialPositions: number[], dimension: number): boolean {
  for (let i = 0; i < moons.length; i++) { 
    if (moons[i].positions[dimension] !== initialPositions[i] || moons[i].velocities[dimension] !== 0) {
      return false;
    }
  }
  return true;
}

function findDimensionCycleLength(dimension: number) {
  let steps = 0;

  const initialPositions = [];
  for (let i = 0; i < moons.length; i++) {
    initialPositions.push(moons[i].positions[dimension]);
  }

  while (true) {
    applyGravity(dimension);
    applyVelocity(dimension);
    steps++;

    if (areWeBackAtInitialState(initialPositions, dimension)) {
      return steps;
    }
  }
}

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
function getLeastCommonMultiple(x: number, y: number): number {
  return (!x || !y) ? 0 : Math.abs((x * y) / getGreatestCommonDivisor(x, y));
}

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
function getGreatestCommonDivisor(x: number, y: number): number {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

initializeMoons();

const cycleLength0 = findDimensionCycleLength(0);
const cycleLength1 = findDimensionCycleLength(1);
const cycleLength2 = findDimensionCycleLength(2);

const solution = getLeastCommonMultiple(getLeastCommonMultiple(cycleLength0, cycleLength1), cycleLength2);

console.log(solution);