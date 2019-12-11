import * as fs from 'fs';

// "True" is an asteroid. "False" is empty space.
const asteroids: boolean[][] = [];

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-10/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function initializeAsteroids() {
  const inputLines = getInputLinesFromFile();
  for (const line of inputLines) {
    const asteroidLine: boolean[] = [];
    for (let c = 0; c < line.length; c++) {
      asteroidLine.push(line.charAt(c) === "#");
    }
    asteroids.push(asteroidLine);
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

function getVisibleAsteroidsCountForAsteroidAt(baseX: number, baseY: number): number {
  const width = asteroids[0].length;
  const height = asteroids.length;
  const asteroidsSeen: string[] = [];

  // Starting at the position of the base asteroid, plot a course directly towards each
  // other asteroid, using the minimum possible size steps (where delta-x and delta-y are
  // both still integers). Then, follow those steps. When we encounter an asteroid, add
  // it to a list of asteroids we've seen, then start over with the next target asteroid.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // If there's no asteroid at this position, move to the next x,y position.
      if (!asteroids[x][y]) {
        continue;
      }

      // If this is the position of our base asteroid, move on to the next x,y position.
      if (x === baseX && y === baseY) {
        continue;
      }

      // Set dx and dy ("delta-x" and "delta-y") to the smallest possible integer-size 
      // step size from the base asteroid towards the target asteroid.
      let dx: number = x - baseX;
      let dy: number = y - baseY; 
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
      let newX: number = baseX;
      let newY: number = baseY;
      while (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        newX += dx;
        newY += dy;
        if (asteroids[newX][newY]) {
          const id = asteroidId(newX, newY);
          if (!asteroidsSeen.includes(id)) {
            asteroidsSeen.push(id);
          }
          break;
        }
      }
    }
  }

  return asteroidsSeen.length;
}

function findVisibleAsteroidsCountForBestMonitoringLocation(): number {
  const width = asteroids[0].length;
  const height = asteroids.length;
  
  let mostVisibleAsteroids = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!asteroids[x][y]) {
        continue;
      }

      const visibleAsteroids = getVisibleAsteroidsCountForAsteroidAt(x, y);

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