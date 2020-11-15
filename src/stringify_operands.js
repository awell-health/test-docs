//@flow
import { extract_operands } from './extract_operands'

/**
 * t-examples:
 * - stringify_operands("a === b") === 'JSON.stringify(a) === JSON.stringify(b)'
 * - stringify_operands('') === ''
 */
export const stringify_operands = test_expression => {
  const [left_side, right_side] = extract_operands(test_expression)
  return `JSON.stringify(${left_side}) === JSON.stringify(${right_side})`
}