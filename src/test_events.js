export default function ({ samples,  }) {
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
          if (config.debug) { console.log('assertEvent:', output, expectedOutput); }
          // apply input function
          if (typeof expectedOutput === 'function') {
            return global.assert.equal(expectedOutput(output), true);
          }
          return global.assert[assert ? 'equal' : 'notEqual'](output, expectedOutput);
        });
        // end when done
        if (i === samples.length) { safeResolve(); }
      }
    });
    // // execute the function to listen for and add a
    return beforeEventFn().then(() => {
      return new Promise((done) => setTimeout(done, 600));
    }).then(safeResolve);
}
