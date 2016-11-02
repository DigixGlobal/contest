import assert from 'assert';
import { asyncIterator } from './helpers';

function assertCall({ promise, params, expected = [], transformers = [] }) {
  return promise
  .then((outs) => {
    const outputs = Array.isArray(outs) ? outs : [outs];
    expected.forEach((expectedOutput, i) => {
      // tranform output
      let transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
      // transform expected output
      if (typeof expectedOutput === 'function') {
        if (this.debug) { console.log('assert equal:', transformedOutput, expectedOutput); }
        return assert.equal(true, expectedOutput(transformedOutput), expectedOutput);
      // no transformers set, expected output is a number, and we can transform it
      } else if (!transformers[i] && !isNaN(expectedOutput) && transformedOutput.toNumber) {
        // automatically transform bignumbers
        transformedOutput = transformedOutput.toNumber();
      }
      // log if debug enabled
      if (this.debug) { console.log('assert:', transformedOutput, expectedOutput); }
      // do the test
      return assert.equal(transformedOutput, expectedOutput);
    });
  }).catch((err) => {
    if (this.debug) { console.log('TEST FAILURE: ', err); }
    return assert.ifError(new Error(err));
  });
}

function assertTransaction({ promise }) {
  return promise
  .then((tx) => {
    if (this.debug) { console.log('assertTx:', tx); }
    return assert.ok(tx);
  })
  .catch((err) => {
    if (this.debug) { console.log('TEST FAILURE: it threw', err); }
    return assert.ifError(new Error(err));
  });
}

function throwCatcher({ promise }) {
  return promise
  .then(() => {
    if (this.debug) { console.log('TEST FAILURE: Expected throw but did not throw'); }
    throw new Error('Expected Throw');
  })
  .catch((err) => {
    if (err.message === 'Expected Throw') { throw err; }
    if (this.debug) { console.log('throw:', err); }
    return assert.ok(err);
  });
}


/*
parse this:
._('statement', [5, 2, 1])                A
._('statement', [5, 2, 1], [(a) => a])    A
._('statement', [                         B
  [5, 2, 1],
], [(a) => a])
._('statement', [                         C
  [[1], [2]],
  [[1], [2]],
])
*/

function parseSamples({ samples = [], options }) {
  const altApi = options.type === 'call' && !options.throw;
  let testSamples = samples;
  if (!altApi && !Array.isArray(samples[0])) {
    testSamples = [samples];
  }
  if (altApi && samples[0] !== undefined && !Array.isArray(samples[0][0])) {
    testSamples = [samples];
  }
  return testSamples.map((sample) => {
    const params = !altApi ? sample : sample[0];
    const expected = !altApi ? [] : sample[1];
    return { params, expected };
  });
}

export default function (args) {
  // now do them in series
  const ctx = this;
  return function () {
    return new Promise((resolve, reject) => {
      const { method, options, samples } = args;
      const fn = options.type === 'transaction' ? method : method.call;
      let assersion = options.type === 'transaction' ? assertTransaction : assertCall;
      if (options.throw) { assersion = throwCatcher; }
      // execute the tests in series;
      const tests = parseSamples({ samples, options });
      asyncIterator(tests, ({ params, expected }, callback) => {
        const promise = fn(...params);
        assersion.apply(ctx, [{ ...args, promise, params, expected }]).then(callback).catch(reject);
      }, resolve);
    });
  };
}
