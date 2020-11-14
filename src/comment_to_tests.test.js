import endent from 'endent'
import { comment_to_tests } from './CreateRuntimeAssertionsBasedOnComments'

test('comment_to_test', function () {
  const code = endent`
  /**
  * This is a cool example 
  * t-examples:
  * - true===false
  * This is a comment without anything
  */
  const foo = () => {};
  `
  const expected_output = ["if((JSON.stringify(true) === JSON.stringify(false)) === false){ throw new Error(JSON.stringify(true) + '=/=' + JSON.stringify(false))}"]
  expect(comment_to_tests(code)).toEqual(expected_output)
})

