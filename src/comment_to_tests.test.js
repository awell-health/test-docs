import _endent from 'endent'
import { comment_to_tests } from './CreateRuntimeAssertionsBasedOnComments'
const endent = _endent.default

test('comment_to_test', function () {
  const code = endent`
  /**
  * This is a cool example 
  * t-examples:
  * - true 
  * This is a comment without anything
  */
  const foo = () => {};
  `
  const expected_output = ["if((true) === false){ throw new Error(\"'true' is violated\")}"]
  expect(comment_to_tests(code)).toEqual(expected_output)
})

// test('real-world test', function () {
//   const code = "*\n * Trims a string\n * t-examples:\n * - trim(' hello ') === 'hello'\n "
//   const expected_output = ["if((true) === false){ throw new Error(\"'true' is violated\")}"]
//   expect(comment_to_tests(code)).toEqual(expected_output)
// })