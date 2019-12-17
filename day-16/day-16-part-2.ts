export {};

let initialInput: string = "59772698208671263608240764571860866740121164692713197043172876418614411671204569068438371694198033241854293277505547521082227127768000396875825588514931816469636073669086528579846568167984238468847424310692809356588283194938312247006770713872391449523616600709476337381408155057994717671310487116607321731472193054148383351831456193884046899113727301389297433553956552888308567897333657138353770191097676986516493304731239036959591922009371079393026332649558536888902303554797360691183681625604439250088062481052510016157472847289467410561025668637527408406615316940050060474260802000437356279910335624476330375485351373298491579364732029523664108987"

initialInput = initialInput.repeat(10000);
const messageOffset: number = parseInt(initialInput.substr(0, 7));

// Brute force will take too long, so let's "cheat": For any outputListPosition more than 
// halfway through the message length, we can calculate the value for that position in the 
// next phase by adding up all of the values from the current phase through that position 
// through the end, since those will all be "*1" pattern values, and all the ones before it
// will be "*0" pattern values. AND, therefore, we only need to worry about values starting
// with our messageOffset -- the location of which is well over halfway through the input 
// message for our input. (I wonder if that's the case for everyone's input?)

let input: Int8Array = new Int8Array(initialInput.length - messageOffset);
const output: Int8Array = new Int8Array(initialInput.length - messageOffset);

for (let i = messageOffset; i < initialInput.length; i++) {
  input[i - messageOffset] = parseInt(initialInput.charAt(i));
}

for (let phase = 0; phase < 100; phase++) {
  output[output.length - 1] = input[input.length - 1];
  for (let outputListPosition = input.length - 2; outputListPosition >= 0; outputListPosition--) {
    output[outputListPosition] = (input[outputListPosition] + output[outputListPosition + 1]) % 10;
  }
  input = output;
}

console.log(output.join('').substr(0, 8));

