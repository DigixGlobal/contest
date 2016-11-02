import assert from 'assert';
import { asyncIterator } from './helpers';

function assertCall({ config, promise, params, expected = [], transformers = [] }) {
  return promise
  .then((outs) => {
    const outputs = Array.isArray(outs) ? outs : [outs];
    expected.forEach((expectedOutput, i) => {
      // tranform output
      let transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
      // transform expected output
      if (typeof expectedOutput === 'function') {
        if (config.debug) { console.log('assert equal:', transformedOutput, expectedOutput); }
        return assert.equal(true, expectedOutput(transformedOutput), expectedOutput);
      // no transformers set, expected output is a number, and we can transform it
      } else if (!transformers[i] && !isNaN(expectedOutput) && transformedOutput && transformedOutput.toNumber) {
        // automatically transform bignumbers
        transformedOutput = transformedOutput.toNumber();
      }
      // log if debug enabled
      if (config.debug) { console.log('assert:', transformedOutput, expectedOutput); }
      // do the test
      return assert.equal(transformedOutput, expectedOutput);
    });
  }).catch((err) => {
    if (config.debug) { console.log('TEST FAILURE: ', err); }
    return assert.ifError(new Error(err));
  });
}

function assertTransaction({ promise, config }) {
  return promise
  .then((tx) => {
    if (config.debug) { console.log('assertTx:', tx); }
    return assert.ok(tx);
  })
  .catch((err) => {
    if (config.debug) { console.log('TEST FAILURE: it threw', err); }
    return assert.ifError(new Error(err));
  });
}

function throwCatcher({ promise, config }) {
  return promise
  .then(() => {
    if (config.debug) { console.log('TEST FAILURE: Expected throw but did not throw'); }
    throw new Error('Expected Throw');
  })
  .catch((err) => {
    if (err.message === 'Expected Throw') { throw err; }
    if (config.debug) { console.log('throw:', err); }
    return assert.ok(err);
  });
}

function parseSamples({ samples, expectThrow, type }) {
  const altApi = type === 'call' && !expectThrow;
  let testSamples = samples;
  // standardised sample formats; convert single array into nested array
  if (!altApi) {
    if (!samples) {
      testSamples = [[]];
    } else if (!altApi && !Array.isArray(samples[0])) {
      testSamples = [samples];
    }
  } else { // using alternative API
    if (!samples) {
      testSamples = [[[], []]];
    } else if (!Array.isArray(samples[0][0])) {
      testSamples = [samples];
    } else {
      testSamples = samples;
    }
  }
  return testSamples.map((sample) => {
    const params = !altApi ? sample : sample[0];
    const expected = !altApi ? [] : sample[1];
    return { params, expected };
  });
}

export function batch(args) {
  return function () {
    return new Promise((resolve, reject) => {
      const { samples, contract } = args;
      // TODO parse the inputs better; allow for multiple I/O
      const tests = Object.keys(samples).map((key) => {
        return {
          method: contract[key].call,
          params: [],
          expected: [samples[key]],
        };
      });
      asyncIterator(tests, ({ method, params, expected }, callback) => {
        const promise = method(...params);
        assertCall({ ...args, promise, params, expected }).then(callback).catch(reject);
      }, resolve);
    });
  };
}

export default function (args) {
  // now do them in series
  return function () {
    return new Promise((resolve, reject) => {
      const { method, type, expectThrow } = args;
      const fn = type === 'transaction' ? method : method.call;
      let assersion = type === 'transaction' ? assertTransaction : assertCall;
      if (expectThrow) { assersion = throwCatcher; }
      const tests = parseSamples(args);
      asyncIterator(tests, ({ params, expected }, callback) => {
        const promise = fn(...params);
        assersion({ ...args, promise, params, expected }).then(callback).catch(reject);
      }, resolve);
    });
  };
}
