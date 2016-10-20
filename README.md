# Contest

### Delightful contract assertions for [Truffle](https://github.com/consensys/truffle)

Simplified API for testing contracts; generates mocha tests.

## Features

* Minimal boilerplate for testing contract I/O
* No more wrangling with async/promises
* Runs multiple assertions in parallel
* Handle throw events
* Assert transaction success
* TODO: Events

## Installation

```
npm install --save-dev @digix/contest
```

## Usage

```javascript
const contest = new Contest({ debug: true }); // `debug` defaults to false

describe('usageExample', function() {  
  // manages multiple async assertions
  contest.assert(myContract.safeAdd, 'adds safe integers', [
    [[1, 2], 3], // [[param1, param2], expectedOutput1]
    [[6, 2], 4],
    [[13, 29], 42],
  ], (res) => res.toNumber()); // pass a transformer to parse results
  // manages throws
  contest.throw(myContract.safeAdd, 'throws unsafe integers', [
    [-1, 2], // [param1, param2]
    [20, -1],
  ]);
});

describe('shorthand', function () {
  it('works without setting an it statement', function () {
    // return statement is important if using shorthand
    return contest.assert(myContract.assertMethod, [[[1], 1]]);
  });
});

// assert multiple outputs
contest.assert(myContract.someMethod, 'does some things', [
  [[a, b], [c, d]], // [[param1, param2], [expectedOutput1, expectedOutput2]]
], [(res) => res.toNumber(), (res) => res.toString()]); // [outputTransformation1, outputTransformation2]

describe('transactingMethod', function() {
  // assert that a transaction doesn't mess up
  contest.assertTx(myContract.someMethod, 'does not throw; performs a transaction', [
    [a, b, c, { from: someAccount, gas: ... }],
    [a, b, c],
    [a, b, c],
  ]);
  contest.throwTx(myContract.someMethod, 'does throw; transaction failed', [
    [a, b, c, { from: someAccount, gas: 13 }],
  ]);
})
```

## TODO Roadmap

* Assert for events
* Global re-runs (e.g. try different gas amounts on every test)
* More features...

## Tests

`npm run test`

## License

MIT 2016
