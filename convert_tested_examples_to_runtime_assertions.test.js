import { convert_tested_examples_to_runtime_assertions } from './convert_tested_examples_to_runtime_assertions.js'
import _endent from 'endent'
const endent = _endent.default

test('converts a simple example', () => {
  const code = endent`
  /** t-examples:
  * - test(3) === 4
  * - test(6) === 7
  */
  const test = a => a + 1
  `;
  const transformed_code = endent`
  /** t-examples:
  * - test(3) === 4
  * - test(6) === 7
  */
  const test = a => a + 1;

  if (test(6) === 7 === false) {
    throw new Error("'test(6) === 7' is violated");
  }

  if (test(3) === 4 === false) {
    throw new Error("'test(3) === 4' is violated");
  }
  `
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(transformed_code)
})

test('It should do nothing if there are no comments in the code', () => {
  const code = `const foo = () => {};`
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(code)
})

test('It should do nothing if there are no t-examples', () => {
  const code = endent`
  /**
  * This is a comment without anything
  */
  const foo = () => {};
  `
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(code)
})

test('It should convert the t-examples into assertions if there are comments in addition to t-examples', () => {
  const code = endent`
  /**
  * This is a cool example 
  * t-examples:
  * - true 
  * This is a comment without anything
  */
  const foo = () => {};
  `
  const expected_code = endent`
  /**
  * This is a cool example 
  * t-examples:
  * - true 
  * This is a comment without anything
  */
  const foo = () => {};
  
  if (true === false) {
    throw new Error("'true' is violated");
  }
  `
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(expected_code)
})
