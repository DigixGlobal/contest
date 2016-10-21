# Contest

### Delightful contract assertions for [Truffle](https://github.com/consensys/truffle)

Simplified API for testing contracts; generates mocha tests.

## Features

* Minimal boilerplate for testing contract I/O
* No wrangling with async/promises
* Runs 'it' blocks in series
* Runs calls in parallel for faster testing
* Handle throw events
* Assert transaction success
* Assert contract event data

## Installation

You should be suing truffle.

```
npm install --save-dev @digix/contest
```

Stick this in your test suite.

```javascript
global.contest = new Contest({ debug: true }); // `debug` defaults to false
```

## Usage

**Assesion Suite** ultra-minimal API for asserting calls and transactions.

The first keyword in the `suite` test descriptor determines the the assert type:

* `assert` calls `yourMethod.call` with provided params, expects matches with provided outputs
* `throw` calls `yourMethod.call` with provided paras, and expects it to throw
* `assertTx` calls `yourMethod` with the provided params, expects a transaction to be mined
* `throwTx` calls `yourMethod` with the provided params, expects it to throw

```javascript
 // generates 'describe' block
contest.suite(contract.assertMethod, 'assertMethod suite', [
   // generates 'it' block for `call`
  ['assert runs multiple tests in parallel', [
    // generates an assertion for each of these inputs/outputs
    [[1, 2], [1, 2]],
    // [ [input1, someOptions], [expectedOutput1] -- only expectedOutpus are checked
    [[1, { from: '0x123..' }], [1]],
    // allows for transforming the outputs; test passes if it evaluates to 'true'
    [['2', 2], [2, (val) => val > 1]],
  // pass a transformation array to transform *all* outputs in this block
  ], [(val) => parseInt(val, 10)]],
  // a new assertion block will run it's tests after the above are all completed
  ['assert runs another set of test', [
    [[1, 2], 1], // [ [input1, input2], expectedOutput1 ]
    [[2, 2], [2, 2]], // [ [input1], [input2], [expectedOutput1, expectedOutput2] ]
  ]],
  ['throw when you expect the called method to fail', [
    [1, -1], // `throw` only accepts inputs, no outputs
  ]],
// time for a new method; generates another 'describe' block
]).suite(contract.throwMethod, 'throwMethod suite', [
  // the throw keyword will pass if calling the method causes a throw
  ['throw passes the test if calling the method throws', [
    [1, 2], // this time we don't have outputs, only inputs
    [], // no arguments? no problem, it'll run without params
  ]],
]).suite(contract.assertTxMethod, 'assertTxMethod suite', [
  ['assertTx transaction success', [ // use assertTx to create a transaction and check it gets created
    [1, 4], // again, not outputs, only inputs
  ]],
]).suite(contract.throwTxMethod, 'throwTxMethod suite', [
  ['throwTx transaction failed', [ // use throwTx to create a transaction and check it fails to be created
    [123, 123, 12], // again, not outputs, only inputs
  ]],
]);
```

**Shorthand Suite**

Same as above, but with out descriptors. You must provide your own `desribe` and `it` blocks.

```javascript
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
      ['throw', [
        [],
      ]],
    ]).suite(contract.assertTxMethod, [
      ['assertTx', [
        [1, 2],
      ]],
    ]).suite(contract.throwTxMethod, [
      ['throwTx', [
        [12]
      ]],
    ]);
  });
});
```

**Assert method.call**

You can also call individual methods

```javascript
describe('usageExample', function() {  
  // manages multiple async assertions, creates an 'it' block
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

**Assert event data** (Warning: unstable API - tests pending)


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
  ], {}, eventCausingPromise);
})
```

## Roadmap

* Global config for re-runs (e.g. try different gas amounts on every test)
* More features...
* Cucumber?

```cucumber
Scenario: Interacting with ResolverClient

  Scenario: Non admin fails to gain access
    Given I am Jeff
    And I use the contract ResolverClient
    Then I cannot register contract

  Scenario: Non admin fails to gain access
    Given I am Ace
    And I use the contract ResolverClient
    And I register contract 'a:gold' as '0x123...def'
    Then get contract 'a:gold' is 0x123...def
```

## Tests

`npm run test`

## License

BSD-3-Clause, 2016
