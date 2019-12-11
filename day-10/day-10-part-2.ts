import * as fs from 'fs';

class Asteroid {
  x: number;
  y: number;
  relativeAngle: number;
}

const asteroids: Asteroid[] = [];
let width: number;
let height: number;

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

function getVisibleAsteroidsCountForAsteroid(baseAsteroid: Asteroid): number {
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
            asteroidsSeen.push(asteroidAtPosition);
          }
          break;
        }
      }
    }
  }

  return asteroidsSeen.length;
}

function getAsteroidAt(x: number, y: number): Asteroid {
  return asteroids.find(a => a.x === x && a.y === y);
}

function findVisibleAsteroidsCountForBestMonitoringLocation(): number {  
  let mostVisibleAsteroids = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const baseAsteroid = getAsteroidAt(x, y);
      if (!baseAsteroid) {
        continue;
      }

      const visibleAsteroids = getVisibleAsteroidsCountForAsteroid(baseAsteroid);

      if (visibleAsteroids > mostVisibleAsteroids) {
        mostVisibleAsteroids = visibleAsteroids;
      }
    }
  }

  return mostVisibleAsteroids;
}

initializeAsteroids();
const count = findVisibleAsteroidsCountForBestMonitoringLocation();
console.log(count);