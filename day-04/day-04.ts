function hasAdjacentMatchingCharacters(word: string): boolean {
  for (let i = 1; i < word.length; i++) {
    if (word.charAt(i - 1) === word.charAt(i)) {
      return true;
    }
  }
  return false;
}

function successiveCharactersNeverDecrease(word: string): boolean {
  for (let i = 1; i < word.length; i++) {
    if (word.charAt(i - 1) > word.charAt(i)) {
      return false;
    }
  }
  return true;
}

function countValuesMeetingPasswordCriteria(): number {
  const min: number = 265275;
  const max: number = 781584;
  let matchesFound: number = 0;

  for (let i = min; i <= max; i++) {
    const password: string = String(i);
    if (!hasAdjacentMatchingCharacters(password)) {
      continue;
    }
    if (!successiveCharactersNeverDecrease(password)) {
      continue;
    }
    matchesFound++;
  }

  return matchesFound;
}

console.log(countValuesMeetingPasswordCriteria());