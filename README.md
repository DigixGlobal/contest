# Contest

*Unstable Alpha Release*

### Web3 contract scripting and assertions

Simplified API for testing contracts; generates mocha tests.

## Features

* Minimalist syntax for contract testing
* Handle thrown calls
* Assert transaction success/failure
* Easily assert events data

## Installation

You should be using truffle.

```
npm install --save-dev @digix/contest
```

Stick this at the top of `./tests/index.js` to use `contest` in your your tests.

```javascript
global.contest = new Contest({ debug: true }); // `debug` defaults to false
```

## Example

```javascript
const contest = new Contest({ debug: true });

contest
// use `deploy` or `use` to deploy a new contract
.deploy(MetaCoin, [ 1000, {from: accounts[0] }])
// create a describe block to oragnise tests
.describe('Account Balances')
// pass an object to assert key/value paris for a method
.call('getBalance', 'initializes with correct balances', {
  [accounts[0]]: balance, // ES6 => { '0x123': 100, '0x456': 0 }
  [accounts[1]]: 0, // will envoke and compare result of getBalance('0x456')
})
.describe('Library Import')
.call('getBalanceInEth', 'returns correct value from inherited method', {
  [accounts[0]]: balance * 2,
  [accounts[1]]: 0,
})
// use `tx` to create a transaction. multiple transactions are executed in series
.tx('sendCoin', 'transfer succeeds', [
  [accounts[1], 10, { from: accounts[0] }],
  [accounts[0], 10, { from: accounts[1] }],
})
// switch to to an already-deployed contract with `use`
.use(MetaCoin.deployed())
.describe('Transfer balances')
// listen for events with `watch`. it will match the outputs series with the next `tx` block
.watch('Transfer', 'fires the events correctly', [
  { _from: accounts[0], _to: accounts[1], _value: 10 },
  { _from: accounts[1], _to: accounts[0], _value: 10 },
  { _from: accounts[0], _to: accounts[1], _value: 10 },
])
.tx('sendCoin', 'transfer succeeds', [
  [accounts[1], 10, { from: accounts[0] }],
  [accounts[0], 10, { from: accounts[1] }],
  [accounts[1], 10, { from: accounts[0] }],
])
// if you don't pass a 2nd statement param, it will not create a test, but will executed before the next block with a statements
// the next block will do a series back and forth transactions without asserting
.tx('sendCoin', [
  [accounts[1], 10, { from: accounts[0] }],
  [accounts[0], 10, { from: accounts[1] }],
  [accounts[1], 10, { from: accounts[0] }],
  [accounts[0], 10, { from: accounts[1] }],
])
// the keyword `throws` will cause the test pass only if the method throws
.tx('sendCoin', 'throws when using bad numbers' [
  [accounts[1], -22, { from: accounts[0] }],
})
.call('getBalance', 'balances after transaction are correct', {
  [accounts[0]]: balance - transfer,
  [accounts[1]]: transfer,
})
.done();
```

## Usage

* Contract
  * `deploy(contract, [ params ])`
  * `use(contractInstance)`
* Methods
  * `call(method, statement, samples, transformers)`
  * `tx(method, statement, samples)`
* Events
  * `watch(method, statement, samples)`
* Test
  * `then(promise)`
  * `describe(description)`
  * `done()`

## Roadmap

* Global config for re-runs (e.g. try different gas amounts on every test
* Generate tests from Cucumber? Imagine a future where contracts are verified against english as such:

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
    Then get contract 'a:gold' is '0x123...def'
```

## Tests

`npm run test`

## License

BSD-3-Clause, 2016
