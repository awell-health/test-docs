import { extract_operands } from './extract_operands'

test('extract_operands', () => {
  const [left_side,right_side] = extract_operands('foo("a === b") === bar')
  expect(left_side).toEqual('foo("a === b")')
  expect(right_side).toEqual('bar')
})