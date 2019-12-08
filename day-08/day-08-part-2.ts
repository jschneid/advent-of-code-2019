import * as fs from 'fs';

function getInputFromFile(): string {
    const text: string = fs.readFileSync("day-08/input.txt", "utf8");
    return text;
}

const WIDTH: number = 25;
const HEIGHT: number = 6;
const PIXEL_COUNT: number = WIDTH * HEIGHT;

const layers: string[] = [];
const input: string = getInputFromFile();
let p: number = 0;

while (p < input.length) {
  layers.push(input.substring(p, p + PIXEL_COUNT)); 
  p += PIXEL_COUNT;
}

const canvas: string[] = new Array<string>(PIXEL_COUNT);
canvas.fill("2");

for (let layer of layers) {
    for (let position = 0; position < PIXEL_COUNT; position++) {
        const pixel = layer.charAt(position);
        if ((pixel === "0" || pixel === "1") && canvas[position] === "2") {
            canvas[position] = pixel;
        }
    }
}

let image = "";
for (let position = 0; position < PIXEL_COUNT; position++) {
    if (position % WIDTH === 0) {
        image += '\n';
    }
    
    if (canvas[position] === "0") {
        image = image + " ";
    }
    else if (canvas[position] === "1") {
        image = image + "█";
    }
    else {
        throw "Unrecognized char: " + canvas[position];
    }
}
console.log(image);
