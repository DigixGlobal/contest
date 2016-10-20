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
});
