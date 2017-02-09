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

```javascript
import Contest from '@digix/contest';
const contest = new Contest({ debug: true, timeout: 2000 }); // `debug` defaults to false
```

## Usage

Contest wires up a series of promises for you with a convenient chaining syntax.

Each chain should end in `done` - see the example below for usage.

Before calling methods, you must have a contract deployed:

* Contract
  * `.artifact(truffleArtifact)` for contracts deployed with truffle v3
  * `.deploy(contract, [ params ])` deploys a new instance of contract with given params
  * `.use(contractInstance)` use an existing instance of a an already-deployed contract

Once you have set a contract you can begin scripting against it:

* Methods
  * `.call(method, statement, samples)` call method with a series of statements
  * `.tx(method, statement, samples, transformers)` same as above, initiate transaction
  * If the first word in `statement` is `throw`, contest will expect the call/tx to throw.
  * `samples` in the format `[ sample, sample, sample ]`, or pass a single `sample` for a single test
  * `sample` for non-assertions (call/throw), use format `[input1, input2]`, for assertions, use `[[input1, input2], [output1, output2]]`
  * `output` expected output to match; if output is a function, it will consume the method's output and resolve true/false
  * `transformers` an array of functions that transform the outputs before asserting; e.g. `[v => v.toNumber(),v => '0x' +v]`
* Events
  * `.watch(method, statement, samples)` the next block must be a `tx`, it will match each sample in samples
  * `sample` for `watch` is in the format `{ _param1: output1, _param2: output2 }`
* Test
  * `.describe(description)` new describe block; for organixation only
  * `.then(promise)` return a promise or execute arbitrary code
  * `done()` end each chain with `done` to execute chain

## Helpers

Contest also includes some common test helpers related to Ethereum. See `./src/helpers.js` for details.

* `BIG_INT` BigNumber string representing maximum (256 integer)
* `BIG_INT_MINUS_TWO`
* `ONE_DAY_IN_SECONDS`
* `asyncIterator(iterator, fn, callback)`
* `randomInt(min, max)`
* `randomHex(length, prefix)` - (`prefix` bool adds `0x`)
* `randomAddress(prefix)`

Import them as such: `import { BIG_INT, randomHex } from '@digix/contest/src/helpers';`

## Example

```javascript
const MetaCoin = artifacts.require('./MetaCoin.sol');

new Contest()
.artifact(MetaCoin)
// create a describe block to oragnise tests
.describe('Account Balances')
// pass an object to assert key/value paris for a method
.call('getBalance', 'initializes with correct balances', {
  [accounts[0]]: balance, // ES6 => { '0x123': 100, '0x456': 0 }
  [accounts[1]]: 0, // will envoke and compare result of getBalance('0x456')
})
// notice that we're passing an array here instead of an object, use multi-input-output syntax
.call('getBalance', 'some other statement', [
  [[accounts[0]], [bal => bal > 2]], // pass a function to resolve to `true` rather than equality assertion
  [[accounts[1]], [0],
])
.describe('Library Import')
// call a different method
.call('getBalanceInEth', 'returns correct value from inherited method', {
  [accounts[0]]: balance,
  [accounts[1]]: 0,
})
// use `tx` to create a transaction. multiple transactions are executed in series
.tx('sendCoin', 'transfer succeeds', [
  [accounts[1], 10, { from: accounts[0] }],
  [accounts[0], 10, { from: accounts[1] }],
})
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

* Mocked contract: `npm run test`
* Truffle environment: `cd ./test/truffle; testrpc & truffle test`

## License

BSD-3-Clause, 2016
