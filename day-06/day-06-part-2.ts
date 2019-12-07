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

function getPathFromIdToRoot(id: string): SpaceObject[] {
  const pathToRoot: SpaceObject[] = [];
  
  let spaceObjectPointer = getSpaceObject(id, null);

  while(spaceObjectPointer.orbits) {
    spaceObjectPointer = spaceObjectPointer.orbits;
    pathToRoot.push(spaceObjectPointer);
  }

  // Add the root
  pathToRoot.push(spaceObjectPointer);

  return pathToRoot;
}

function getFirstObjectInCommon(path1: SpaceObject[], path2: SpaceObject[]) {
  for (const spaceObject of path1) {
    if (path2.includes(spaceObject)) {
      return spaceObject;
    }
  }
  throw("Error: No objects in common");
}

function getDistanceToObject(path: SpaceObject[], target: SpaceObject) {
  return path.indexOf(target);
}

buildMap();
const pathFromYouToRoot: SpaceObject[] = getPathFromIdToRoot("YOU");
const pathFromSanToRoot: SpaceObject[] = getPathFromIdToRoot("SAN");
const commonAncestor: SpaceObject = getFirstObjectInCommon(pathFromYouToRoot, pathFromSanToRoot);
const distance1 = getDistanceToObject(pathFromYouToRoot, commonAncestor);
const distance2 = getDistanceToObject(pathFromSanToRoot, commonAncestor);
console.log(distance1 + " + " + distance2 + " = " + (distance1 + distance2));