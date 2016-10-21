/* eslint-env mocha */
/* globals assert */
/* eslint-disable no-console, no-unused-expressions, prefer-arrow-callback, func-names */

import assert from 'assert';
import contract from './helpers/mockContract';

import Contest from '../src';

global.assert = assert;

describe('contest', function () {
  const contest = new Contest({ debug: true });

  describe('assert', function () {
    contest.assert(contract.assertMethod, 'it asserts calls', [
      [[1], 1],
    ]);
  });

  describe('assertTx', function () {
    contest.assertTx(contract.assertTxMethod, 'it asserts transactions', [
      [1],
    ]);
  });

  describe('throw', function () {
    contest.throw(contract.throwMethod, 'it throws calls', [
      [1],
    ]);
  });

  describe('throwTx', function () {
    contest.throwTx(contract.throwTxMethod, 'it throws transactions', [
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
      [[1], 1],
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
  describe('events', function () {
    // // assert equal
    // const admin = '0x123';
    // const owner = '0xdef';
    // contest.assertEvent(contract.AssertEvent, 'fires when transferred', [
    //   // array  of object you pass to `assertEvent` or `throwEvent` will be asserted in series as events are fired
    //   { _from: admin, _to: owner, _value: 2 },
    //   { _from: owner, _to: admin, _value: val => val > 40 }, // pass a function to assert `true`
    // ], {
    //   value: (res) => parseInt(res, 10),
    // }, () => {
    //   return contract.triggerEvent('AssertEvent', { _from: admin, _to: owner, _value: '2' })
    //   .then(() => contract.triggerEvent('AssertEvent', { _from: owner, _to: admin, _value: '203' }))
    //   .then(() => new Promise((resolve) => setTimeout(resolve, 3000))); // NOTE do we need this?
    // });
    /*
    // assert not equal
    const user = '1337h4x0r';
    contest.throwEvent(contract.ThrowEvent, 'does not broadcast sensitive information', [
      { _user: user, _secret: data => !!data }, // `throwEvent` will fail if all defined outputs match or resolve to `true`
    ], () => {
      contract.triggerEvent('ThrowEvent', { _user: user, _secret: 'hunter2' });
    });
    */
  });
});
