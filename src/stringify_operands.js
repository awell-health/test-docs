//@flow
import { extract_operands } from './extract_operands'

/**
 * Stringifies the operands to compare objects and arrays
 * t-examples:
 * - stringify_operands("a === b") === 'JSON.stringify(a) === JSON.stringify(b)'
 * - stringify_operands('') === ''
 */
export const stringify_operands = test_expression => {
  const [left_side, right_side] = extract_operands(test_expression)
  if(left_side === '_COULD_NOT_EXTRACT_' && right_side === '_COULD_NOT_EXTRACT_'){
    return ''
  }
  return `JSON.stringify(${left_side}) === JSON.stringify(${right_side})`
}