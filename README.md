# documentation tests

## TLDR; why does this repository exist?

To make writing tests easier. 

Instead of

```
// file addOne.js
export const addOne = nbr => nbr + 1
```
```
// file addOne.spec.js
test('addOne', () => {
  expect(addOne(1)).toEqual(2)
  expect(addOne(undefined)).toEqual(NaN)
  expect(addOne([])).toEqual(NaN)
  expect(addOne({}).toEqual("[object Object]1")
})
```

You can do

```
// file addOne.js
/** 
* t-examples:
* - addOne(1) === 2
* - addOne(undefined) === NaN 
* - addOne([]) === NaN 
* - addOne({}) === "[object Object]1"
*/ 
export const addOne = nbr => nbr + 1
```

## How to use

This code base uses both Jest and "Documentation tests". Just run "npm run test:doc-tests"

## Reasoning 

Tests are great because:
- they allow you to refactor your code
- they are great documentation (i.e. they never get out of sync with the code)

Therefore we should make it as easy as possible to write tests.

Tests are easy to write if:
- Boilerplate is minimal
- They are close to the code being tested

The first reason is obvious. Boilerplate sucks. 

The second reason may be less obvious. 
When your tests are in another file you need go to that file to read the tests.
This is a small inconvenience.
Given that you're reading code all day long it is worth removing that small inconvenience.
Also when you're writing tests it's nice to have the code close at hand to see what test cases you're missing. 

## Note of caution 

This is a proof-of-concept. There is a lot to be done. MRs welcome! 
If you're interested to collaborate send an email at yann@awellhealth.com.
Biggest help is to get this tool to work with your project and tell me how you did. 

Todos:
- finding a better name than "documentation test" for the tool
- cleanup code
- Add more documentation
- ensuring that all test cases get executed (see APPROACH.md for more context)
- using the plugin on different JS stacks (i.e. working with typescript, flow, client, node ...)
- DO all code generation with Babel instead of hacky string manipulation
- Guide to integrate tool in your stack
- Guide to add this tool in your CI/CD pipeline
- Make test cases multiline. Currently it all needs to fit in one line(e.g."- foo('bar') === 'foobar'") 
- Make the tool configurable (e.g, change "t-examples: " to something else)
- a cool logo
- more tests
- Create a nice summary of the test run
- have .only functionality like in Jest
- Integrations with IDEs
- prettify when test fails (e.g., make it clearer where the delta is with actual and expected output)
- make it optional to write the function and change === to = (e.g, instead of `* - addOne(1) === 2` have `* - f(1) = 2` or `(1) => 2`) 

# Reference links
List of resources I've used to write this plugin
- [playground](https://lihautan.com/babel-ast-explorer/#?eyJiYWJlbFNldHRpbmdzIjp7InZlcnNpb24iOiI3LjYuMCJ9LCJ0cmVlU2V0dGluZ3MiOnsiaGlkZUVtcHR5Ijp0cnVlLCJoaWRlTG9jYXRpb24iOnRydWUsImhpZGVUeXBlIjp0cnVlLCJoaWRlQ29tbWVudHMiOnRydWV9LCJjb2RlIjoiIn0=)
- [tutorial](https://lihautan.com/step-by-step-guide-for-writing-a-babel-transformation/)
- [Babel handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/README.md)