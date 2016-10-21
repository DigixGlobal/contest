/* eslint-env mocha */
/* globals assert */
/* eslint-disable no-console, no-unused-expressions, prefer-arrow-callback, func-names */

import assert from 'assert';
import contract from './helpers/mockContract';

import Contest from '../src';

global.assert = assert;

describe('contest', function () {
  const contest = new Contest({ debug: true });

  contest.suite(contract.assertMethod, 'assertMethod suite', [ // generates 'describe' block
    ['assert runs multiple tests in paralel', [ // generates 'it' block for `call`
      [[1, 2], [1, 2]], // generates an assert for each of these inputs/outputs
      [[1, { from: '0x123..' }], [1]], // [ [input1, someOptions], [expectedOutput1] -- only expectedOutpus are checked
      [['2', 2], [2, (val) => val > 1]], // allows transformations for outputs, test passes if it evaluates to 'true'
    ], [(val) => parseInt(val, 10)]], // you can also global output transformers as another param
    ['assert runs another set of test', [ // will run another test after the above are all completed
      [[1, 2], 1], // [ [input1, input2], expectedOutput1 ]
      [[2, 2], [2, 2]], // [ [input1], [input2], [expectedOutput1, expectedOutput2] ]
    ]],
  ]).suite(contract.throwMethod, 'throwMethod suite', [ // generates 'describe' block
    ['throw passes the test if calling the method throws', [
      [1, 2], // this time we don't have outputs, only inputs
      [], // no arguments? no problem
    ]],
  ]).suite(contract.assertTxMethod, 'assertTxMethod suite', [
    ['assertTx transaction success', [ // use assertTx to create a transaction and check it gets created
      [1, 4], // again, not outputs, onlt inputs
    ]],
  ]).suite(contract.throwTxMethod, 'throwTxMethod suite', [
    ['throwTx transaction failed', [ // use throwTx to create a transaction and check it fails to be created
      [123, 123, 12], // again, not outputs, onlt inputs
    ]],
  ]);

  describe('shorthand suite', function () {
    it('does not create if or describe blocks with the shorthand style', function () {
      contest.suite(contract.assertMethod, [
        ['assert', [
          [[1, 2], [1, 2]],
          [[2], [2]],
        ]],
        ['assert', [
          [[33], [33]],
        ]],
      ]).suite(contract.throwMethod, [
        ['throw', []],
      ]).suite(contract.assertTxMethod, [
        ['assertTx', [
          [1, 2],
        ]],
      ]).suite(contract.throwTxMethod, [
        ['throwTx', []],
      ]);
    });
  });

  describe('assert', function () {
    contest.assert(contract.assertMethod, 'it asserts calls', [
      [[1], 1],
    ]);
    contest.assert(contract.throwMethod, '***SHOULD FAIL*** catches thrown error', [
      [[1], 1],
    ]);
  });

  describe('assertTx', function () {
    contest.assertTx(contract.assertTxMethod, 'it asserts transactions', [
      [1],
    ]);
    contest.assertTx(contract.throwTxMethod, '***SHOULD FAIL*** catches thrown error', [
      [1],
    ]);
  });

  describe('throw', function () {
    contest.throw(contract.throwMethod, 'throws properly', [
      [1],
    ]);
    contest.throw(contract.assertMethod, '***SHOULD FAIL*** fails when there is no error', [
      [1],
    ]);
  });

  describe('throwTx', function () {
    contest.throwTx(contract.throwTxMethod, 'catches thrown transaction', [
      [1],
    ]);
    contest.throwTx(contract.assertTxMethod, '***SHOULD FAIL*** fails when there is no error', [
      [1],
    ]);
  });

  describe('shorthand', function () {
    it('works without setting a statment', function () {
      // return statement is important if using shorthand
      return contest.assert(contract.assertMethod, [[[1], 1]]);
    });
  });

  describe('multiple samples', function () {
    contest.assert(contract.assertMethod, 'asserts multiple samples', [
      [[1], [1]],
      [[2], 2],
      [[3], 3],
    ]);
  });

  describe('multiple outputs', function () {
    contest.assert(contract.assertMethod, 'asserts multiple outputs', [
      [[1, 2], [1, 2]],
    ]);
  });

  describe('transforms', function () {
    contest.assert(contract.assertMethod, 'asserts multiple outputs with transforms', [
      [[1, 1], [3, 5]],
    ], [(res) => (res + 2), (res) => (res + 4)]);
  });

  // TODO
  // describe('events', function () {
  //   // // assert equal
  //   // const admin = '0x123';
  //   // const owner = '0xdef';
  //   // contest.assertEvent(contract.AssertEvent, 'fires when transferred', [
  //   //   // array  of object you pass to `assertEvent` or `throwEvent` will be asserted in series as events are fired
  //   //   { _from: admin, _to: owner, _value: 2 },
  //   //   { _from: owner, _to: admin, _value: val => val > 40 }, // pass a function to assert `true`
  //   // ], {
  //   //   value: (res) => parseInt(res, 10),
  //   // }, () => {
  //   //   return contract.triggerEvent('AssertEvent', { _from: admin, _to: owner, _value: '2' })
  //   //   .then(() => contract.triggerEvent('AssertEvent', { _from: owner, _to: admin, _value: '203' }))
  //   //   .then(() => new Promise((resolve) => setTimeout(resolve, 3000))); // NOTE do we need this?
  //   // });
  //   /*
  //   // assert not equal
  //   const user = '1337h4x0r';
  //   contest.throwEvent(contract.ThrowEvent, 'does not broadcast sensitive information', [
  //     { _user: user, _secret: data => !!data }, // `throwEvent` will fail if all defined outputs match or resolve to `true`
  //   ], () => {
  //     contract.triggerEvent('ThrowEvent', { _user: user, _secret: 'hunter2' });
  //   });
  //   */
  // });
});
