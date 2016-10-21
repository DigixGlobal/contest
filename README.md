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

**Assert method.call**

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
    // TODO remove extra brackets requirement if there's only item in array
    return contest.assert(myContract.assertMethod, [[[1], 1]]);
  });
});

// assert multiple outputs and transform outputs before asserting
contest.assert(myContract.someMethod, 'does some things', [
  [[a, b], [c, d]], // [[param1, param2], [expectedOutput1, expectedOutput2]]
], [(res) => res.toNumber(), (res) => res.toString()]); // [outputTransformation1, outputTransformation2]
```

**Assert method transaction success**

```javascript
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

**Assert event data**


```javascript
describe('Event Listener', function () {
  // define some function that returns a promise and causes events to fire
  function eventCausingPromise () {
    return testContract.transfer(2, USERS.owner, { from: USERS.admin })
    .then(() => testContract.transfer(1, USERS.admin, { from: USERS.owner }))
    // wait 3 seconds if you want, it'll resolve sooner if all the assertions are complete.
    .then(() => new Promise((resolve) => setTimeout(resolve, 3000)));
  }

  // optional output transformation function
  const outputTransformation = {
    value: (res) => res.toNumber()
  }

  // assert equal
  contest.assertEvent(testContract.RegisterEvent, 'fires when transferred', [
    // array  of object you pass to `assertEvent` or `throwEvent` will be asserted in series as events are fired
    { _from: USERS.admin, _to: USERS.owner, _value: 2 },
    { _from: USERS.owner, _to: USERS.admin, _value: val => val > 40 }, // pass a function to assert `true`
  ], outputTransformation, eventCausingPromise);

  // assert not equal
  contest.throwEvent(testContract.AnotherEvent, 'does not broadcast sensitive information', [
    { _user: '1337h4x0r', _secret: data => !!data }, // `throwEvent` will fail if all defined outputs match or resolve to `true`
  ], eventCausingPromise);
})
```

**Future API Update: Promise-style test suite** *TODO*

Just some brainstorming about future api options...

```javascript
// future ultra-minimal api options?
contest.use(myContract.someMethod, 'call')
.assert('allows admins to update', [[1, 2, { from: admin }], [1, 2]])
.assert('lots some users update' [
  [['cool', 'cat'], [true, false]],
  [['cool', 'dog'], [true, true]],
  [['uncool', 'cat'], [false, false]]
], [(str) => str === 'cool', (str) => str === 'dog'])
.throw('does not work with bad params', [2, 3])
.use(myContract.someOtherMethod, 'transaction')
.assert('allows transactions from admin account', [{ from: admin }])
.throw('does not allow transactions from admin account');
```


## TODO Roadmap

* Assert for events
* Global re-runs (e.g. try different gas amounts on every test)
* Abstract even further with batches of statements for the same method (see below)
* More features...

## Tests

`npm run test`

## License

MIT 2016
