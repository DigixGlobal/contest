function setUp(type, [method, _statement, _samples, _transformers], handler) {
  let statement = _statement;
  let samples = _samples || [];
  let transformers = _transformers || [];
  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      const params = type !== 'assert' ? sample : sample[0] || [];
      const expected = type !== 'assert' ? null : sample[1] || [];
      const fn = type !== 'transact' ? method.call : method;
      const promise = fn.apply(null, params);
      return handler({ promise, params, expected, transformers });
    }));
  }
  if (typeof statement !== 'string') {
    statement = null;
    samples = _statement || [];
    transformers = _samples || [];
    return promiseFactory();
  }
  const xString = samples.length > 1 ? ` x${samples.length}` : '';
  return global.it(`${statement}${xString}`, promiseFactory);
}

export default class Contest {

  assert(...opts) {
    return setUp('assert', opts, ({ promise, params, expected, transformers }) => {
      return promise
      .then(function (res = []) {
        const outputs = Array.isArray(res) ? res : [res];
        const expectedOutput = Array.isArray(expected) ? expected : [expected];
        expectedOutput.forEach((output, i) => {
          const test = transformers[i] ? transformers[i](output, params) : output;
          global.assert.equal(test, outputs[i]);
        });
      }).catch(err => global.assert.ifError(err));
    });
  }

  throw(...opts) {
    return setUp('throw', opts, ({ promise, params }) => {
      return promise
      .then(() => global.assert.ifError(`did not throw: ${JSON.stringify(params)}`))
      .catch((err) => global.assert.ok(err));
    });
  }

  assertTx(...opts) {
    return setUp('transact', opts, ({ promise }) => {
      return promise
      .then((tx) => global.assert.ok(tx))
      .catch((err) => global.assert.ifError(err));
    });
  }

  throwTx(...opts) {
    return setUp('transact', opts, ({ promise, params }) => {
      return promise
      .then(() => global.assert.ifError(`did not throw: ${JSON.stringify(params)}`))
      .catch((err) => global.assert.ok(err));
    });
  }

  listenFor() {

  }

  stopListeningTo() {

  }
}
