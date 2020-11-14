import R from 'ramda'
import babel from '@babel/core';

const example_comment = `
/** t-examples:
* - test(3) === 4
* - test(6) === 7
*/
`
const trim= s => s.trim()
const replaceAll = (old,_new) => s => s.split(old).join(_new)
const remove_js_comment_tokens = a_string => replaceAll('\n* ','\n')(a_string)
  .replace('/**','')
  .replace('*/','').trim()

const extract_tests_from_test_comment = test_comment => R.tail(test_comment.split('-').map(trim))
const remove_t_example_identifier = s => s.replace('t-examples:','').trim()

const comment_to_tests = comment => R.compose(
  extract_tests_from_test_comment,
  remove_t_example_identifier,
  remove_js_comment_tokens
)(comment)

console.log(comment_to_tests(example_comment))
// process.exit()

const is_test_comment = comment => comment.indexOf('t-examples') !== -1

const code = `
${example_comment}
const test = a => a + 1
`;


const get_comment_nodes_from_node = node => node.leadingComments
const get_comment_values_from_node = R.compose(R.pluck('value'),get_comment_nodes_from_node)
const node_has_comment = node => Array.isArray(get_comment_nodes_from_node(node))
const node_has_test_example_comment = node => node_has_comment(node) && R.compose(R.any(is_test_comment),get_comment_values_from_node)(node)

const output = babel.transformSync(code, {
  plugins: [
    function myCustomPlugin({types: t}) {
      return {
        visitor: {
          Program(path, state) {
            path.traverse({
              enter(path) {
                if(node_has_test_example_comment(path.node)){
                  console.log('path.node',get_comment_values_from_node(path.node))
                }
              }
            });
          },
          Identifier(path) {},
        },
      };
    },
  ],
});

console.log(output.code); 