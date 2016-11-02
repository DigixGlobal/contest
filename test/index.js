/* eslint-env mocha */

import contract from './helpers/mockContract';
import Contest from '../src';

const contest = new Contest({ debug: false });

contest
.use(contract) // or deploy a new one...
.describe('Balance Transfers')
// if you an object and no method, it will call each method and asser the given output
._('initializes with correct balances', {
  assertMethod1: 1,
  assertMethod2: 2,
})
// if you pass an object + method, it will be transformed into tests like: [[key], [val]]
._('assertMethod', 'initialization values are correct', {
  a: 'a',
  b: 'b',
})
// pass no test; call with empty params; assert it doesnt throw
._('assertMethod', 'pass no test; assert that it doesnt throw')
// pass sigle test; assert with inputs and outputs
._('assertMethod', 'pass one test; assert i/o', [[1], [1]])
// pass multiple tests
._('assertMethod', 'pass multiple tests', [
  [[2], [2]],
  [[3], [3]],
])
._('assertMethod', 'initializes with correct values', [
  [[1, 3], [1, true]],
  [[22, 4], [22, true]],
  [[1, 3], [1, true]],
  // passing a transformer as a 4th param will transform all outputs
], [null, (val) => val > 2])
._('assertMethod', 'has all the correct values ', [
  [[1, 3, { from: 'bob' }], [1, 3]],
  [[1, 2], [1, 2]],
  [[1, 9], [1, (val) => val > 5]], // pass a function to output to asser true
])
// events -- expect them to fire in the next next assersion
._('AssertEvent event', 'fires expected events in the next block', [
  { 0: 1, 1: 3 },
  { 0: val => val > 20, 1: 4 },
  { 0: 1, 1: 3 },
])
._('eventMethod transaction', 'is succesful when used by admin', [
  [1, 3],
  [22, 4],
  [1, 3],
])
// .describe('some other block')
._('throwTxMethod transaction', 'throws when used by a non-admin', [])
._('throwMethod', 'throws when initialization values are incorrect', [])
.done();
