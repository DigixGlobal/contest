/* eslint-env mocha */

import assert from 'assert';
import contract from './helpers/mockContract';
import Contest from '../src';

const contest = new Contest({ debug: false });

contest
.use(contract) // or deploy a new one...
.describe('Balance Transfers')
._('initializes with correct values', {
  [] : 1,
  [] : 2,
})
._('assertMethod', 'initializes with correct values', [
  [1, 3], [3, 3]], [(val) => 3]
)
._('throwMethod throws', 'when called with bad values', [
  [[1, 3, { from: 'bob' }], [1, 3]],
  [[1, 2], [1, 2]],
  [[1, 9], [1, (val) => val > 5]]
])
.describe('some other block')
._('throwMethod transaction', 'is succesful when used by admin', [1, 1])
// .wait(1, 2000) // wait a bit for tempo....
// .timeout(123123)
._('assertTxMethod transaction throws', 'when admin transacts', [1, 3, 2])
._('throwTxMethod transaction throws', 'when a throw method is called', [])
.describe('Some other section')
._('assertMethod call', 'when using bad values', [[1], [1]])
._('throwMethod call throws', 'when initialization values are incorrect', [12313, 123, 23])
.done();
// ._('balanceOf transacts when user is an admin', [
//   [5, 2, 3],
//   [5, 2, 3],
//   [5, 2, 3],
// ])
// ._('balanceOf transaction throws when')
// .describe('Done initializing')
// ._('balanceOf transaction throws when some condition happen')
// ._('balanceOf transaction throws when some other condition happens')
// ._('balanceOf calls when my condition is met', [])
// ._('balanceOf call throws when my condition is met')
// ._('balanceOf transacts when my condition is met')
// ._('balanceOf transaction throws when my condition is met')
// ._('MyEvent fires when my condition is met')
// ._('MyEvent does not fire when my condition is met')
