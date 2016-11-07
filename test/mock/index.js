/* eslint-env mocha */
import contract, { instantiator } from './mockContract';
import Contest from '../../src';
import assert from 'assert';

const contest = new Contest({ debug: false });

contract.testName = 'pre-deployed contract';

function beforeTest(c) {
  return new Promise((resolve) => {
    console.log('      hello there....', c.testName);
    setTimeout(resolve, 10);
  });
}

contest
.use(contract)
// .deploy(instantiator, ['first contract'])
// .deploy(ContractInstance)  // deploy and then use under the hood...
.describe('Balance Transfers')
// if you an object and no method, it will call each method and asser the given output
.call('initializes with correct balances', {
  assertMethod1: 1,
  assertMethod2: 2,
})
// if you pass an object + method, it will be transformed into tests like: [[key], [val]]
.call('assertMethod', 'initialization values are correct', {
  a: 'a',
  b: 'b',
})
.call('assertMethod', [
  [[2], [2]],
  [[3], [3]],
])
.tx('assertTxMethod', [
  [1, 2, 3],
])
.tx('assertTxMethod', [
  [1, 2, 3],
])
// jump in with arbitray 'before' blocks
.then((contract) => {
  console.log('calling A from my custom before block', contract.contract_name);
})
// jump in with arbitray 'before' blocks
.then(beforeTest)
.then(beforeTest)
// pass no test; call with empty params; assert it doesnt throw
.call('assertMethod', 'dont assert outputs, just assert that it doesnt throw', [
  [[], []],
])
// create a custom assersion with the oldskool format
.it('says hello and asserts', (c) => {
  console.log('      hello from the "it" block... ', c.testName);
  return new Promise((resolve) => {
    assert.equal(1, 1);
    setTimeout(resolve, 30);
  });
})
// pass sigle test; assert with inputs and outputs
.call('assertMethod', 'pass one test; assert i/o', [[1], [1]])
// if you expect the method to throw, start your statment with 'throws'
.call('throwMethod', 'throws with bad input data', [[2], [1]])
// pass multiple tests
.call('assertMethod', 'pass multiple tests', [
  [[2], [2]],
  [[3], [3]],
])
.call('assertMethod', 'initializes with correct values', [
  [[1, 3], [1, true]],
  [[22, 4], [22, true]],
  [[1, 3], [1, true]],
  // passing a transformer as a 4th param will transform all outputs before asserting
], [null, (val) => val > 2])
.then(beforeTest)
.call('assertMethod', 'has all the correct values ', [
  [[1, 3, { from: 'bob' }], [1, 3]],
  [[1, 22], [1, 22]],
  [[1, 9], [1, (val) => val > 5]], // pass a function as an output output to assert true
])
.deploy(instantiator, ['first contract'])
// events -- expect them to fire in the next next assersion
.then(beforeTest)
.watch('AssertEvent', 'fires expected events in the next block', [
  { 0: 1, 1: 3 },
  { 0: val => val > 20, 1: 4 },
  { 0: 1, 1: 3 },
])
.tx('eventMethod', 'makes the expected trasnfers', [
  [1, 3],
  [22, 4],
  [1, 3],
])
.watch('AssertEvent', 'fires expected events in the next block', [
  { 0: 1, 1: 3 },
  { 0: val => val > 20, 1: 4 },
  { 0: 1, 1: 3 },
])
.tx('eventMethod', 'makes the expected trasnfers', [
  [1, 3],
  [22, 4],
  [1, 3],
])
.tx('throwTxMethod', 'throws when used by a non-admin', [])
.use(contract)
.tx('throwTxMethod', 'throws when used by a non-admin', [])
.then(beforeTest)
.call('throwMethod', 'throws when initialization values are incorrect', [])
.done();
