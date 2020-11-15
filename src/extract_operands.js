import * as babel from '@babel/parser'
import generate from "@babel/generator";

export const extract_operands = expression => {
  const result  = babel.parseExpression(expression)
  const { left: left_node, right: right_node } = result
  const res = [generate(left_node).code, generate(right_node).code]
  return res
}