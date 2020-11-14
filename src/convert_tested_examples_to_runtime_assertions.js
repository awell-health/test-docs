import * as babel from '@babel/core'
import { CreateRuntimeAssertionsBasedOnComments } from './CreateRuntimeAssertionsBasedOnComments'

export const convert_tested_examples_to_runtime_assertions = code => babel.transformSync(code, {
  plugins: [CreateRuntimeAssertionsBasedOnComments],
}).code

