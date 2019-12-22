import * as fs from 'fs';

function getInputLinesFromFile(): string[] {
  const text: string = fs.readFileSync("day-22/input.txt", "utf8");
  const lines: string[] = text.split("\n");
  return lines;
}

let deck: number[] = [];
const DECK_SIZE = 10007;

function initializeStandardSpaceDeck() {
  for (let i = 0; i < DECK_SIZE; i++) {
    deck.push(i);
  }
}

function performCut(count: number) {
  let cutDeck: number[] = [];
  if (count >= 0) {
    for (let i = count; i < deck.length; i++) {
      cutDeck.push(deck[i]);
    }
    for (let i = 0; i < count; i++) {
      cutDeck.push(deck[i]);
    }
  } 
  else if (count < 0) {
    count = -1 * count;
    for (let i = deck.length - count; i < deck.length; i++) {
      cutDeck.push(deck[i]);
    }
    for (let i = 0; i < deck.length - count; i++) {
      cutDeck.push(deck[i]);
    }
  }
  deck = cutDeck;
}

function performDealIntoNewStack() {
  deck.reverse();
}

function performDealWithIncrement(increment: number) {
  let newDeck: number[] = [];
  let position = 0; 
  for (let i = 0; i < deck.length; i++) {
    newDeck[position] = deck[i];
    position = (position + increment) % deck.length;
  }
  deck = newDeck;
}

function performTechnique(techniqueString: string) {
  const techniqueTokens = techniqueString.split(' ');
  if (techniqueString.startsWith("cut")) {
    const count: number = parseInt(techniqueTokens[techniqueTokens.length - 1]);
    performCut(count);
  }
  else if (techniqueString.startsWith("deal with increment")) {
    const count: number = parseInt(techniqueTokens[techniqueTokens.length - 1]);
    performDealWithIncrement(count);
  }
  else if (techniqueString.startsWith("deal into new stack")) {
    performDealIntoNewStack();
  }
}

function performTechniques() {
  const techniqueStrings: string[] = getInputLinesFromFile();
  for (const techniqueString of techniqueStrings) {
    performTechnique(techniqueString);
  }
}

initializeStandardSpaceDeck();
performTechniques();
console.table(deck);
console.log(deck.indexOf(2019));

