//@flow
import _endent from 'endent'
import { clean_comment } from './CreateRuntimeAssertionsBasedOnComments'
const endent = _endent.default



test('clean_comment should remove leading comments', () => {
  const code = endent`
  /**
  * This is a cool example 
  * t-examples:
  * - true 
  */
  `

  const expected_output = endent`
  - true
  `
  expect(clean_comment(code)).toEqual(expected_output)
})

test('clean_comment should remove leading comments even if not started with /*', () => {
  const code = endent`
  *
  * This is a cool example 
  * t-examples:
  * - true 
  *
  `

  const expected_output = endent`
  - true
  `
  expect(clean_comment(code)).toEqual(expected_output)
})