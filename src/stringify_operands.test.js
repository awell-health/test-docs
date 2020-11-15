import { stringify_operands } from './stringify_operands'

test('stringify_operands',() => {
  const outcome = stringify_operands('a === b')
  expect(outcome).toEqual('JSON.stringify(a) === JSON.stringify(b)')
})

test('inception case', () => {
  const outcome = stringify_operands('stringify_operands("a === b") === \'JSON.stringify(a) === JSON.stringify(b)\'')
  expect(outcome).toEqual(`JSON.stringify(stringify_operands(\"a === b\")) === JSON.stringify('JSON.stringify(a) === JSON.stringify(b)')`)
})