import * as fs from 'fs';

class ChemicalQuantity {
  chemical: string;
  quantity: number;

  constructor(chemical: string, quantity: number) {
    this.chemical = chemical;
    this.quantity = quantity;
  }
}

class Reaction {
  inputs: ChemicalQuantity[];
  output: ChemicalQuantity;

  constructor(inputs: ChemicalQuantity[], output: ChemicalQuantity) {
    this.inputs = inputs;
    this.output = output;
  }
}

let reactions: Reaction[] = [];

function parseChemicalQuantityString(input: string): ChemicalQuantity {
  const quantityAndChemical = input.trim().split(" ");
  const quantity = parseInt(quantityAndChemical[0].trim());
  const chemicalQuantity: ChemicalQuantity = new ChemicalQuantity(quantityAndChemical[1].trim(), quantity);
  return chemicalQuantity;
}

function setReactionsFromInputFile() {
  const text: string = fs.readFileSync("day-14/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  for (const line of lines) {
    const inputsAndOutput: string[] = line.split(" => ");

    const inputStrings: string[] = inputsAndOutput[0].trim().split(",");
    const inputs: ChemicalQuantity[] = [];
    for (const inputString of inputStrings) {
      const input: ChemicalQuantity = parseChemicalQuantityString(inputString);
      inputs.push(input);
    }

    const output = parseChemicalQuantityString(inputsAndOutput[1]);

    const reaction: Reaction = new Reaction(inputs, output);
    reactions.push(reaction);
  }
}


function debugDumpReactions() {
  let output: string = "";
  for (const reaction of reactions) {
    for (const input of reaction.inputs) {
      output += input.quantity + " " + input.chemical + ", " 
    }
    output += "==> " + reaction.output.quantity + " " + reaction.output.chemical + "\n";
  }
  console.log(output);
}

setReactionsFromInputFile();

debugDumpReactions();