import R from 'ramda'
import * as babel from '@babel/parser'
import generate from '@babel/generator'

/**
 * t-examples:
 * - extract_operands("a === b") === ['a','b']
 * - extract_operands('') === ['_COULD_NOT_EXTRACT_', '_COULD_NOT_EXTRACT_']
 */
export const extract_operands = expression => {
  const result  = R.tryCatch(() => babel.parseExpression(expression), R.always(''))()
  if(result === ''){
    return ['_COULD_NOT_EXTRACT_','_COULD_NOT_EXTRACT_']
  }
  const { left: left_node, right: right_node } = result
  return [generate(left_node).code, generate(right_node).code]
}