import methodTester from './methodTester';
import eventTester from './eventTester';

const noThrowError = 'Method invocation did not cause an error';

export default class Contest {

  constructor(opts = {}) {
    this.debug = opts.debug;
  }

  suite(method, _describe, _tests) {
    const describe = !_tests ? null : _describe;
    const tests = !_tests ? _describe : _tests;
    const runTests = () => {
      return tests.forEach((test) => {
        const [descriptor, ...args] = test;
        const testType = descriptor.split(' ').shift();
        const statement = descriptor.split(' ').slice(1).join(' ').trim() || undefined;
        const testParams = [method, statement, ...args];
        return this[testType](...testParams);
      });
    };
    if (describe) {
      global.describe(describe, runTests);
    } else {
      runTests();
    }
    return this;
  }

  values(contract, statement, values) {
    const keys = Object.keys(values);
    return global.describe(statement, () => {
      return keys.forEach((key) => {
        const method = contract[key];
        const expected = values[key].value || values[key];
        const transform = values[key].transform;
        return this.assert(method, key, [[[], expected]], transform);
      });
    });
  }

  assert(...opts) {
    return methodTester('assert', opts, ({ promise, params, expected, transformers }) => {
      return promise
      .then((res = []) => {
        // allow flexibility with array
        const outputs = Array.isArray(res) ? res : [res];
        const expectedOutput = Array.isArray(expected) ? expected : [expected];
        expectedOutput.forEach((eOutput, i) => {
          // tranform output
          const transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
          // transform expected output
          if (typeof eOutput === 'function') {
            if (this.debug) { console.log('assert equal:', transformedOutput, eOutput); }
            return global.assert.equal(true, eOutput(transformedOutput));
          }
          // log if debug enabled
          if (this.debug) { console.log('assert:', transformedOutput, expectedOutput); }
          // do the test
          return global.assert.equal(transformedOutput, eOutput);
        });
      }).catch((err) => {
        if (this.debug) { console.log('TEST FAILURE: ', err); }
        return global.assert.ifError(new Error(err));
      });
    });
  }

  assertTx(...opts) {
    return methodTester('transact', opts, ({ promise }) => {
      return promise
      .then((tx) => {
        if (this.debug) { console.log('assertTx:', tx); }
        return global.assert.ok(tx);
      })
      .catch((err) => {
        if (this.debug) { console.log('TEST FAILURE: it threw'); }
        return global.assert.ifError(new Error(err));
      });
    });
  }

  throw(...opts) {
    return methodTester('throw', opts, this._throwCatcher());
  }

  throwTx(...opts) {
    return methodTester('transact', opts, this._throwCatcher());
  }

  assertEvent(...opts) {
    return eventTester(opts, this._eventAsserter(true));
  }

  throwEvent(...opts) {
    return eventTester(opts, this._eventAsserter(false));
  }

  _throwCatcher() {
    return ({ promise }) => {
      return promise
      .then(() => {
        if (this.debug) { console.log('TEST FAILURE: did not throw'); }
        throw new Error(noThrowError);
      })
      .catch((err) => {
        if (err.message === noThrowError) { throw err; }
        if (this.debug) { console.log('throw:', err); }
        return global.assert.ok(err);
      });
    };
  }

  _eventAsserter(assert) {
    return (output, expectedOutput) => {
      if (this.debug) { console.log('assertEvent:', output, expectedOutput); }
      // apply input function
      if (typeof expectedOutput === 'function') {
        return global.assert.equal(expectedOutput(output), true);
      }
      return global.assert[assert ? 'equal' : 'notEqual'](output, expectedOutput);
    };
  }
}
