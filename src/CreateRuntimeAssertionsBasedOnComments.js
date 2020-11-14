import R from 'ramda'
import _template from '@babel/template'

const template = _template.default
/**
 * Trims a string
 * t-examples:
 * - trim(' hello ') === 'hello'
 */
const trim = s => s.trim()

const replaceAll = (old, _new) => s => s.replace(old,_new)
const remove_js_comment_tokens = a_string => replaceAll(/\n(\s*)\*(?!\/)/g, '\n')(a_string)
  .replace(/^\*/,'')
  .replace('/**', '')
  .replace('*/', '').trim()

const extract_tests_from_test_comment = test_comment => {
  const lines = test_comment.split('\n')
  const is_a_bullet_line = l => l.trim().startsWith('- ')
  const remove_bullet_line = l => l.replace('- ', '')
  return lines.filter(is_a_bullet_line).map(remove_bullet_line).map(trim)
}
const remove_t_example_identifier = s => s.replace('t-examples:', '').trim()
const remove_leading_comments = s => {
  const [_, rest] = s.split('t-examples:')
  return rest
}
export const clean_comment = R.compose(
  remove_t_example_identifier,
  remove_leading_comments,
  remove_js_comment_tokens
)
const throw_if_false = expression => `if((${expression}) === false){ throw new Error("'${expression}' is violated")}`
export const comment_to_tests = comment => R.compose(
  R.map(throw_if_false),
  extract_tests_from_test_comment,
  clean_comment
)(comment)
const is_test_comment = comment => comment.indexOf('t-examples') !== -1
const get_comment_nodes_from_node = node => node.leadingComments
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
              tests.reverse().forEach(test => {
                path.insertAfter(template.ast(test))
              })
            }
          }
        })
      }
    }
  }
}