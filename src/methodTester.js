import parseOptions from './parseOptions';
import { arrayify } from './helpers';

export default function methodTester(type, opts, handler) {
  const { method, statement, samples, transformers } = parseOptions(opts);
  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      const params = type !== 'assert' ? arrayify(sample) : arrayify(sample[0]);
      const expected = type !== 'assert' ? [] : arrayify(sample[1]);
      const fn = type !== 'transact' ? method.call : method;
      const promise = fn(...params);
      return handler({ promise, params, expected, transformers });
    }));
  }
  return statement ? global.it(statement, promiseFactory) : promiseFactory();
}
