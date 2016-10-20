# Contest

### Delightful contract assertions for [Truffle](https://github.com/consensys/truffle)

Simplified API for testing contracts; generates mocha tests.

## Features

* Minimal boilerplate for testing contract I/O
* Run multiple assertions in parallel
* Assert transaction success
* TODO: Events

## Installation

```
npm install --save-dev @digix/contest
```

## Usage

```javascript
describe('safeAdd', function() {  
  // manages multiple async assertions
  contest.assert(myContract.safeAdd, 'adds safe integers', [
    [[1, 2], 3], // [[param1, param2], expectedOutput1]
    [[6, 2], 4],
    [[13, 29], 42],
  ], (res) => res.toNumber()); // pass a transformer to parse results
  // manages throws
  contest.throw(myContract.safeAdd, 'throws unsafe integers', [
    [[2 ** 256, 2], // [param1, param2]
    [[20, 2 ** 256],
  ]);
})

// assert multiple outputs
contest.assert(myContract.someMethod, 'does some things', [
  [[a, b], [c, d]], // [[param1, param2], [expectedOutput1, expectedOutput2]]
], [(res) => res.toNumber(), (res) => res.toString()]); // [outputTransformation1, outputTransformation2]

describe('transactingMethod', function() {
  // assert that a transaction doesn't mess up
  contest.transact(myContract.someMethod, 'doesnt throw; performs a transaction', [
    [a, b, c],
    [a, b, c],
    [a, b, c],
  ]);
})

// TODO assertions for events
contest.listenFor('someEvent');
contest.stopListeningTo('someEvent');
```

## Tests

`npm run test`

## License

MIT 2016
