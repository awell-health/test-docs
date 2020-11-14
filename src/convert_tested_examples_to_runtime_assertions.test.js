import { convert_tested_examples_to_runtime_assertions } from './convert_tested_examples_to_runtime_assertions.js'
import endent from 'endent'

test('converts a simple example', () => {
  const code = endent(`
  /** t-examples:
  * - test(3) === 4
  * - test(6) === 7
  */
  const test = a => a + 1
  `);
  const transformed_code = endent(`
  "use strict";
  
  /** t-examples:
  * - test(3) === 4
  * - test(6) === 7
  */
  const test = a => a + 1;

  if (JSON.stringify(test(6)) === JSON.stringify(7) === false) {
    throw new Error(JSON.stringify(test(6)) + '=/=' + JSON.stringify(7));
  }

  if (JSON.stringify(test(3)) === JSON.stringify(4) === false) {
    throw new Error(JSON.stringify(test(3)) + '=/=' + JSON.stringify(4));
  }
  `)
  expect(convert_tested_examples_to_runtime_assertions(code)).toEqual(transformed_code)
})

test('It should do nothing if there are no comments in the code', () => {
  const code = endent(`
  "use strict";
  
  const foo = () => {};
  `)
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(code)
})

test('It should do nothing if there are no t-examples', () => {
  const code = endent(`
  "use strict";
  /**
  * This is a comment without anything
  */
  
  const foo = () => {};
  `)
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(code)
})

test('It should convert the t-examples into assertions if there are comments in addition to t-examples', () => {
  const code = endent(`
  /**
  * This is a cool example 
  * t-examples:
  * - true === false
  * This is a comment without anything
  */
  const foo = () => {};
  `)
  const expected_code = endent(`
  "use strict";
  
  /**
  * This is a cool example 
  * t-examples:
  * - true === false
  * This is a comment without anything
  */
  const foo = () => {};
  
  if (JSON.stringify(true) === JSON.stringify(false) === false) {
    throw new Error(JSON.stringify(true) + '=/=' + JSON.stringify(false));
  }
  `)
  expect(convert_tested_examples_to_runtime_assertions(code)).toBe(expected_code)
})
