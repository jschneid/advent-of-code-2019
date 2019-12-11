import * as fs from 'fs';

class Asteroid {
  x: number;
  y: number;
  relativeAngle: number;
}

const asteroids: Asteroid[] = [];
let width: number;
let height: number;
let currentCannonAngle: number; 

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-10/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function initializeAsteroids() {
  const inputLines = getInputLinesFromFile();

  height = inputLines.length;
  width = inputLines[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (inputLines[y].charAt(x) === "#") {
        const asteroid = new Asteroid();
        asteroid.x = x;
        asteroid.y = y;
        asteroids.push(asteroid);
      }
    }
  }
}

// https://stackoverflow.com/a/4202114/12484
function greatestCommonDivisor(a: number, b: number): number
{
    while (b > 0)
    {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function asteroidId(x: number, y: number): string {
  return x + "," + y;
}

function getVisibleAsteroids(baseAsteroid: Asteroid): Asteroid[] {
  const asteroidsSeen: Asteroid[] = [];

  // Starting at the position of the base asteroid, plot a course directly towards each
  // other asteroid, using the minimum possible size steps (where delta-x and delta-y are
  // both still integers). Then, follow those steps. When we encounter an asteroid, add
  // it to a list of asteroids we've seen, then start over with the next target asteroid.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // If there's no asteroid at this position, move to the next x,y position.
      const targetAsteroid = getAsteroidAt(x, y);
      if (!targetAsteroid) {
        continue;
      }

      // If this is our base asteroid, move on to the next x,y position.
      if (targetAsteroid === baseAsteroid) {
        continue;
      }

      // Set dx and dy ("delta-x" and "delta-y") to the smallest possible integer-size 
      // step size from the base asteroid towards the target asteroid.
      let dx: number = x - baseAsteroid.x;
      let dy: number = y - baseAsteroid.y; 
      while (true) {
        const divisor = greatestCommonDivisor(Math.abs(dx), Math.abs(dy));
        if (divisor > 1) { 
          dx = dx / divisor;
          dy = dy / divisor;
        }
        else {
          break;
        }
      }

      // One step at a time, move from the base asteroid to the target asteroid. 
      // When we encounter any asteroid, add it to the list of asteroids we've seen
      // (if it's not already on there), then start over with the next target.
      let newX: number = baseAsteroid.x;
      let newY: number = baseAsteroid.y;
      while (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        newX += dx;
        newY += dy;
        const asteroidAtPosition = getAsteroidAt(newX, newY);
        if (asteroidAtPosition) {
          if (!asteroidsSeen.includes(asteroidAtPosition)) {
            // We need to flip the delta-y because the atan2 calculation assumes that y-coordinates have higher values at the top,
            // but our coordiante system for this problem has the lowest y-coordinate (0) at the top.
            asteroidAtPosition.relativeAngle = getRelativeAngle(dx, -1 * dy);
            
            asteroidsSeen.push(asteroidAtPosition);
          }
          break;
        }
      }
    }
  }

  return asteroidsSeen;
}

function getRelativeAngle(dx: number, dy: number): number {
  // https://stackoverflow.com/a/15994225/12484
  return Math.atan2(dy, dx); // In radians
}

function getAsteroidAt(x: number, y: number): Asteroid {
  return asteroids.find(a => a.x === x && a.y === y);
}

function vaporize(asteroid: Asteroid) {
  currentCannonAngle = asteroid.relativeAngle;
  const index = asteroids.indexOf(asteroid);
  asteroids.splice(index, 1);
}

function nextAsteroidToVaporize(visibleTargets: Asteroid[]): Asteroid {
  // Sort the visible targets in clockwise order.
  visibleTargets.sort((a,b) => (a.relativeAngle > b.relativeAngle) ? -1 : ((b.relativeAngle > a.relativeAngle) ? 1 : 0)); 

  // Return the next target that's clockwise from the current cannon position.
  let target = visibleTargets.find(a => a.relativeAngle < currentCannonAngle);
  if (target) {
    return target;
  }

  // If we didn't get one, it's because we're at the point where the radians scale wraps around from negative to positive. 
  // So, return the visible target with the maximum relative angle.
  let maxAngle = Number.NEGATIVE_INFINITY;
  for (let asteroid of asteroids) {
    if (asteroid.relativeAngle > maxAngle) {
      maxAngle = asteroid.relativeAngle;
      target = asteroid;
    }
  }
  return target;
}

function vaporize200Asteroids() {
  // Start just barely left of vertical so that the first target the cannon will find moving clockwise is the one straight up
  currentCannonAngle = Math.atan2(1, 0) + 0.000001;

  // From the part 1 solution
  const baseAsteroid = getAsteroidAt(20, 19);

  const pi = Math.atan2(0, -1);

  for (let vaporizedCount = 0; vaporizedCount < 200; vaporizedCount++) {
    const visibleTargets: Asteroid[] = getVisibleAsteroids(baseAsteroid);

    const target: Asteroid = nextAsteroidToVaporize(visibleTargets);
    
    console.log("#" + (vaporizedCount+1) + " Now vaporizing asteroid at: " + target.x + "," + target.y + " at angle " + (target.relativeAngle / pi) + "pi. Cannon is at angle " + (currentCannonAngle / pi) + "pi.");

    vaporize(target);
  }
}

initializeAsteroids();
vaporize200Asteroids();
