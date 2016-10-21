import parseOptions from './parseOptions';

export default function methodTester(type, opts, handler) {
  const { method, statement, samples, transformers } = parseOptions(opts);
  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      const params = type !== 'assert' ? sample : sample[0] || [];
      const expected = type !== 'assert' ? null : sample[1] || [];
      const fn = type !== 'transact' ? method.call : method;
      const promise = fn(...params);
      return handler({ promise, params, expected, transformers });
    }));
  }
  return statement ? global.it(statement, promiseFactory) : promiseFactory();
}
