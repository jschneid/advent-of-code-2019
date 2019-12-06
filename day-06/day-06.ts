import * as fs from 'fs';

const spaceObjects: SpaceObject[] = [];

class SpaceObject {
  id: string; 
  orbits: SpaceObject;
}

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-06/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

function getSpaceObject(id: string, orbits: string): SpaceObject {
  let spaceObject = spaceObjects.find(so => so.id === id);
  if (spaceObject === undefined) {

    spaceObject = new SpaceObject();
    spaceObject.id = id;

    spaceObjects.push(spaceObject);
  }

  if (orbits) {
    spaceObject.orbits = getSpaceObject(orbits, null);
  }

  return spaceObject;
}

function buildMap() {
  const orbits: string[] = getInputLinesFromFile();
  for (const orbit of orbits) {
    const objectIds: string[] = orbit.split(")");

    const spaceObject = getSpaceObject(objectIds[1], objectIds[0]);
  }
}

function countOrbits(): number {
  let orbitCount = 0;
  
  for (const spaceObject of spaceObjects) {
    let spaceObjectPointer: SpaceObject = spaceObject;
    while(spaceObjectPointer.orbits) {
      orbitCount++;
      spaceObjectPointer = spaceObjectPointer.orbits;
    }
  }
  return orbitCount;
}

buildMap();
console.log(countOrbits());