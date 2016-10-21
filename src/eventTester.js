import parseOptions from './parseOptions';

export default function eventTester(opts, handler) {
  const { method, statement, samples, transformers, beforeEventFn } = parseOptions(opts);
  function promiseFactory() {
    return new Promise((resolve) => {
      const watcher = method({ fromBlock: 'latest' });
      let resolved = false;
      let i = 0;
      function safeResolve() {
        if (!resolved) {
          resolved = true;
          watcher.stopWatching();
          global.assert.equal(i, samples.length, `${samples.length - i} events did not fire!`);
          resolve();
        }
      }
      watcher.watch((error, result) => {
        if (!error && !resolved) {
          i++;
          // run the assert for each output
          const expectedOutput = samples[i - 1];
          Object.keys(expectedOutput).forEach((key) => {
            // apply output transformer
            const output = transformers[key] ? transformers[key](result.args[key]) : result.args[key];
            handler(output, expectedOutput[key]);
          });
          // end when done
          if (i === samples.length) { safeResolve(); }
        }
      });
      // execute the function to listen for and add a
      return beforeEventFn().then(() => {
        return new Promise((done) => setTimeout(done, 600));
      }).then(safeResolve);
    });
  }
  return statement ? global.it(statement, promiseFactory) : promiseFactory();
}
