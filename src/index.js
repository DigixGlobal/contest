import methodTester from './methodTester';
import eventTester from './eventTester';

export default class Contest {

  constructor(opts = {}) {
    this.debug = opts.debug;
  }

  assert(...opts) {
    return methodTester('assert', opts, ({ promise, params, expected, transformers }) => {
      return promise
      .then((res = []) => {
        const outputs = Array.isArray(res) ? res : [res];
        const expectedOutput = Array.isArray(expected) ? expected : [expected];
        expectedOutput.forEach((eOutput, i) => {
          const transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
          if (this.debug) { console.log('assert:', transformedOutput, eOutput); }
          return global.assert.equal(transformedOutput, eOutput);
        });
      }).catch((err) => {
        if (this.debug) { console.log('TEST FAILURE: ', err); }
        return global.assert.ifError(err);
      });
    });
  }

  throw(...opts) {
    return methodTester('throw', opts, ({ promise, params }) => {
      return promise
      .then(() => {
        if (this.debug) { console.log('TEST FAILURE: did not throw'); }
        return global.assert.ifError(`did not throw: ${JSON.stringify(params)}`);
      })
      .catch((err) => {
        if (this.debug) { console.log('throw:', err); }
        return global.assert.ok(err);
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
        if (this.debug) { console.log('TEST FAILURE: did not throw'); }
        return global.assert.ifError(err);
      });
    });
  }

  throwTx(...opts) {
    return methodTester('transact', opts, ({ promise, params }) => {
      return promise
      .then(() => {
        if (this.debug) { console.log('TEST FAILURE: did not throw'); }
        return global.assert.ifError(`did not throw: ${JSON.stringify(params)}`);
      })
      .catch((err) => {
        if (this.debug) { console.log('throwTx:', err); }
        return global.assert.ok(err);
      });
    });
  }

  assertEvent(...opts) {
    return eventTester(opts, (output, expectedOutput) => {
      // apply input function
      if (typeof expectedOutput === 'function') {
        return global.assert.equal(expectedOutput(output), true);
      }
      return global.assert.equal(output, expectedOutput);
    });
  }

  throwEvent(...opts) {
    return eventTester(opts, (output, expectedOutput) => {
      // apply input function
      if (typeof expectedOutput === 'function') {
        return global.assert.equal(expectedOutput(output), false);
      }
      return global.assert.notEqual(output, expectedOutput);
    });
  }
}
