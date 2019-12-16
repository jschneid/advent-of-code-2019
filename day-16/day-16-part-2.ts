export {};

const initialInput: string = "59772698208671263608240764571860866740121164692713197043172876418614411671204569068438371694198033241854293277505547521082227127768000396875825588514931816469636073669086528579846568167984238468847424310692809356588283194938312247006770713872391449523616600709476337381408155057994717671310487116607321731472193054148383351831456193884046899113727301389297433553956552888308567897333657138353770191097676986516493304731239036959591922009371079393026332649558536888902303554797360691183681625604439250088062481052510016157472847289467410561025668637527408406615316940050060474260802000437356279910335624476330375485351373298491579364732029523664108987"

function patternForOutputListPosition(outuptListPosition: number): number[] {
  let pattern: number[] = [];
  const basePattern: number[] = [0, 1, 0, -1];
  for (let i = 0; i < initialInput.length + 1; i++) {
    pattern.push(basePattern[Math.trunc((i / (outuptListPosition + 1)) % 4)]);
  }
  pattern.shift();
  return pattern;
}

let input: string = initialInput;
for (let phase = 0; phase < 100; phase++) {
  let output: string = "";

  for (let outputListPosition = 0; outputListPosition < initialInput.length; outputListPosition++) {
    const pattern = patternForOutputListPosition(outputListPosition);
    let positionValue: number = 0;
    for (let i = 0; i < initialInput.length; i++) {
      positionValue += parseInt(input.charAt(i)) * pattern[i];
    }

    // Add the ones digit to the phase output
    output += Math.abs(positionValue) % 10;
  }
 
  input = output;
}

console.log(input);