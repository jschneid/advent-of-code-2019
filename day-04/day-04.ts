function hasExactlyTwoAdjacentMatchingCharacters(word: string): boolean {
  for (let i = 1; i < word.length; i++) {
    if (word.charAt(i - 1) === word.charAt(i)) {
      if (i === word.length - 1) {
        return true;
      }      
      else if (word.charAt(i) != word.charAt(i + 1)) {
        return true;
      } 
      else {
        const matchingCharacter: string = word.charAt(i);
        while (i + 1 < word.length && word.charAt(i + 1) === matchingCharacter) {
          i++;
        }
      }
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
    if (!hasExactlyTwoAdjacentMatchingCharacters(password)) {
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