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
let chemicalQuantitiesInStock: ChemicalQuantity[] = [];

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

function quantityOfChemicalInStock(chemical: string): number {
  let chemicalQuantityInStock: ChemicalQuantity = chemicalQuantitiesInStock.find(chemicalQuantity => chemicalQuantity.chemical === chemical);
  if (chemicalQuantityInStock) {
    return chemicalQuantityInStock.quantity;
  }
  return 0;
}

function modifyQuantityOfChemicalInStock(chemical: string, quantity: number) {
  let chemicalQuantityInStock: ChemicalQuantity = chemicalQuantitiesInStock.find(chemicalQuantity => chemicalQuantity.chemical === chemical);

  if (!chemicalQuantityInStock) {
    chemicalQuantityInStock = new ChemicalQuantity(chemical, 0);
    chemicalQuantitiesInStock.push(chemicalQuantityInStock);
  }

  chemicalQuantityInStock.quantity += quantity;

  if (chemicalQuantityInStock.quantity < 0) {
    throw "Quantity of " + chemicalQuantityInStock.chemical + " is now negative (" + chemicalQuantityInStock.quantity + ")!";
  }
}

function produceChemical(chemical: string) {
  if (chemical === "ORE") {
    if (quantityOfChemicalInStock("ORE") > 0) {
      modifyQuantityOfChemicalInStock("ORE", -1);
    }
    else {
      throw "We were able to produce " + quantityOfChemicalInStock("FUEL") + " FUEL before running out of ore.";
    }
  }
  else {
    const reaction: Reaction = reactions.find(reaction => reaction.output.chemical === chemical);

    for (const input of reaction.inputs) {
      // Produce at least as much as we need of this input chemical.
      while (quantityOfChemicalInStock(input.chemical) < input.quantity) {
        produceChemical(input.chemical);
      }

      // Now that we have enough, "use up" (subtract) as much of that input as we need for this reaction.
      modifyQuantityOfChemicalInStock(input.chemical, -1 * input.quantity);
    }

    // Now that we've used up the required inputs, add the output.
    modifyQuantityOfChemicalInStock(chemical, reaction.output.quantity);
  }
}

setReactionsFromInputFile();

modifyQuantityOfChemicalInStock("ORE", 103774200);

while (true) {
  produceChemical("FUEL");
}