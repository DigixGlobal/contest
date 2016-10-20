function setUp(type, [method, _statement, _samples, _transformers], handler) {
  let statement = _statement;
  let samples = _samples || [];
  let transformers = _transformers || [];

  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      const params = type !== 'assert' ? sample : sample[0] || [];
      const expected = type !== 'assert' ? null : sample[1] || [];
      const fn = type !== 'transact' ? method.call : method;
      const promise = fn(...params);
      return handler({ promise, params, expected, transformers });
    }));
  }

  // no statement
  if (typeof statement !== 'string') {
    statement = null;
    samples = _statement || [];
    transformers = _samples || [];
    return promiseFactory();
  }
  // is statement
  const xString = samples.length > 1 ? ` x${samples.length}` : '';
  return global.it(`${statement}${xString}`, promiseFactory);
}

export default class Contest {

  constructor({ debug }) {
    this.debug = debug;
  }

  assert(...opts) {
    return setUp('assert', opts, ({ promise, params, expected, transformers }) => {
      return promise
      .then((res = []) => {
        const outputs = Array.isArray(res) ? res : [res];
        const expectedOutput = Array.isArray(expected) ? expected : [expected];
        expectedOutput.forEach((eOutput, i) => {
          const transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
          if (this.debug) { console.log('assert:', transformedOutput, eOutput); }
          return global.assert.equal(transformedOutput, eOutput);
        });
      }).catch(err => global.assert.ifError(err));
    });
  }

  throw(...opts) {
    return setUp('throw', opts, ({ promise, params }) => {
      return promise
      .then(() => global.assert.ifError(`did not throw: ${JSON.stringify(params)}`))
      .catch((err) => {
        if (this.debug) { console.log('throw:', err); }
        return global.assert.ok(err);
      });
    });
  }

  assertTx(...opts) {
    return setUp('transact', opts, ({ promise }) => {
      return promise
      .then((tx) => {
        if (this.debug) { console.log('assertTx:', tx); }
        return global.assert.ok(tx);
      })
      .catch(err => global.assert.ifError(err));
    });
  }

  throwTx(...opts) {
    return setUp('transact', opts, ({ promise, params }) => {
      return promise
      .then(() => global.assert.ifError(`did not throw: ${JSON.stringify(params)}`))
      .catch((err) => {
        if (this.debug) { console.log('throwTx:', err); }
        return global.assert.ok(err);
      });
    });
  }

  listenFor() {

  }

  stopListeningTo() {

  }
}
