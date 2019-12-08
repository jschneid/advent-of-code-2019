import * as fs from 'fs';

function getInputFromFile(): string {
  const text: string = fs.readFileSync("day-08/input.txt", "utf8");
  return text;
}

const layers: string[] = [];
const input: string = getInputFromFile();
let p: number = 0;

while (p < input.length) {
  layers.push(input.substring(p, p + 150)); 
  p += 150;
}

let fewestZeroes: number = 32767;
let layerWithFewestZeroes: number;

for (let i = 0; i < layers.length; i++) {

  // https://stackoverflow.com/a/881111/12484
  const zeroes = (layers[i].match(/0/g) || []).length;

  if (zeroes < fewestZeroes) {
    fewestZeroes = zeroes;
    layerWithFewestZeroes = i;
  }
}

const ones = (layers[layerWithFewestZeroes].match(/1/g) || []).length;
const twos = (layers[layerWithFewestZeroes].match(/2/g) || []).length;

console.log(ones * twos);