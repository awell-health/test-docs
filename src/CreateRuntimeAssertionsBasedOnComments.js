import R from 'ramda'
import template from '@babel/template'
import { stringify_operands } from './stringify_operands'
import { extract_operands } from './extract_operands'

/**
 * Trims a string
 * t-examples:
 * - trim(' hello ') === 'hello'
 * - trim('  ') === ''
 */
const trim = s => s.trim()

/**
 * removes jsdoc comment characters from a string
 * t-examples:
 * - remove_js_comment_tokens('/** hello \n* world\n*\/') === 'hello \n world'
 * - remove_js_comment_tokens('') === ''
 */
const remove_js_comment_tokens = a_string => {
  const replaceAll = (old, _new) => s => s.replace(old,_new)
  return replaceAll(/\n(\s*)\*(?!\/)/g, '\n')(a_string)
    .replace(/^\*/,'')
    .replace('/**', '')
    .replace('*/', '').trim()
}

/**
 * t-examples:
 * - extract_tests_from_test_comment('- hello\n - world')  === ['hello','world']
 * - extract_tests_from_test_comment('- hello\n -world')  === ['hello']
 * - extract_tests_from_test_comment('- hello -world')  === ['hello -world']
 */
const extract_tests_from_test_comment = test_comment => {
  const lines = test_comment.split('\n')
  const is_a_bullet_line = l => l.trim().startsWith('- ')
  const remove_bullet_line = l => l.replace('- ', '')
  return lines.filter(is_a_bullet_line).map(remove_bullet_line).map(trim)
}
/**
 * t-examples:
 * - remove_t_example_identifier('Hellot-examples: world') === 'Hello world'
 * - remove_t_example_identifier('t-examples: t-examples:') === ' t-examples:'
 */
const remove_t_example_identifier = s => s.replace('t-examples:', '')

/**
 *  t-examples:
 *  - remove_leading_comments('h t-examples: w') === 't-examples: w'
 *  - remove_leading_comments('hello t-examples: world') === 't-examples: world'
 *  - remove_leading_comments('hello t-examples: t-examples') === 't-examples: t-examples'
 *  - remove_leading_comments('') === ''
 *  - remove_leading_comments('Comment') === 'Comment'
 */
const remove_leading_comments = s => {
  const [_, ...rest] = s.split('t-examples:')
  if(rest.length === 0) return s
  return `t-examples:${rest.join('t-examples:')}`
}
/**
 * t-examples:
 * - clean_comment('/** hello \n * t-examples: world \n*\/') === 'world'
 * - clean_comment('') === ''
 */
export const clean_comment = R.compose(
  trim,
  remove_t_example_identifier,
  remove_leading_comments,
  remove_js_comment_tokens
)

/**
 * TODO: do this with babel
 * TODO: Use R.equals or similar instead of JSON.stringify() === JSON.stringify()
 * t-examples:
 * - throw_if_false("1 === 1") === 'if((JSON.stringify(1) === JSON.stringify(1)) === false){ throw new Error(JSON.stringify(1) + \'=/=\' + JSON.stringify(1))}'
 * - throw_if_false('') === ''
 */
const throw_if_false = expression => {
  const [ left_side, right_side ] = extract_operands(expression)
  if( left_side === '_COULD_NOT_EXTRACT_' && right_side === '_COULD_NOT_EXTRACT_'){ return '' }
  return `if((${stringify_operands(expression)}) === false){ throw new Error(JSON.stringify(${left_side}) + '=/=' + JSON.stringify(${right_side}))}`
}

/**
 * t-examples:
 * - comment_to_tests('hello world') === []
 * - comment_to_tests(' - hello world') === []
 * - comment_to_tests('* - hello world') === []
 * - comment_to_tests('/** test-examples:\n * - hello === world') === ["if((JSON.stringify(hello) === JSON.stringify(world)) === false){ throw new Error(JSON.stringify(hello) + '=/=' + JSON.stringify(world))}"]
 */
export const comment_to_tests = comment => R.compose(
  R.reject(R.equals('')),
  R.map(throw_if_false),
  extract_tests_from_test_comment,
  clean_comment
)(comment)

/**
 * t-examples:
 * - is_test_comment('t-examples') === true
 * - is_test_comment('/* t-examples *\/') === true
 * - is_test_comment('yolo') === false
 */
const is_test_comment = comment => comment.indexOf('t-examples') !== -1

/**
 * t-examples:
 * - get_comment_nodes_from_node({leadingComments: [{a: 1}]}) === [{a:1}]
 * - get_comment_nodes_from_node({}) === undefined
 * - get_comment_nodes_from_node(undefined) === undefined
 * - get_comment_nodes_from_node(1) === undefined
 */
const get_comment_nodes_from_node = (node = {}) => node.leadingComments

/**
 * t-examples:
 * - get_comment_values_from_node({leadingComments: [{value: 'a'}, {value: 'b'}]}) === ['a', 'b']
 */
const get_comment_values_from_node = R.compose(R.pluck('value'), get_comment_nodes_from_node)

const node_has_comment = node => Array.isArray(get_comment_nodes_from_node(node))

const node_has_test_example_comment = node => node_has_comment(node) && R.compose(R.any(is_test_comment), get_comment_values_from_node)(node)

export const CreateRuntimeAssertionsBasedOnComments = function({ types: t }) {
  return {
    visitor: {
      Program (path, state) {
        path.traverse({
          enter (path) {
            if (node_has_test_example_comment(path.node)) {
              const comments = get_comment_values_from_node(path.node)
              const tests = comments.flatMap(comment_to_tests)
              tests.forEach(test => {
                path.insertAfter(template.ast(test))
              })
            }
          }
        })
      }
    }
  }
}