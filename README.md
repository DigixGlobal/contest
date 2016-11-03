# Contest

*Unstable Alpha Release* 

### Delightful contract assertions for [Truffle](https://github.com/consensys/truffle)

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

## Usage

```

TODO Document API! Check ./test in the meantime, or an older version of this readme.

```

## Roadmap

* Global config for re-runs (e.g. try different gas amounts on every test)
* More features...
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
