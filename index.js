import { convert_tested_examples_to_runtime_assertions } from './convert_tested_examples_to_runtime_assertions.js'

const example_comment = `
/** t-examples:
* - test(3) === 4
* - test(6) === 7
*/
`
const code = `
${example_comment}
const test = a => a + 1
`;

const output = convert_tested_examples_to_runtime_assertions(code);
console.log(output);