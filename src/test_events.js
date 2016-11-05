import assert from 'assert';

export default function ({ samples, contract, methodName, config, transformers = [] }) {
  return function (promiseToListenFor) {
    return new Promise((resolve, reject) => {
      let resolved = false;
      let i = 0;
      const watcher = contract()[methodName]('latest');
      function safeResolve() {
        if (!resolved) {
          resolved = true;
          watcher.stopWatching();
          assert.equal(i, samples.length, `${samples.length - i} events did not fire!`);
          resolve();
        }
      }
      watcher.watch((error, result) => {
        if (!error && !resolved) {
          i++;
          // run the assert for each output
          const expectedOutput = samples[i - 1];
          Object.keys(expectedOutput).forEach((key) => {
            const eOutput = expectedOutput[key];
            // apply output transformer
            const output = transformers[key] ? transformers[key](result.args[key]) : result.args[key];
            if (config.debug) { console.log('assertEvent:', output, eOutput); }
            // apply input function
            if (typeof eOutput === 'function') {
              return assert.equal(true, eOutput(output), eOutput);
            }
            return assert.equal(output, eOutput);
          });
          // end when done
          if (i === samples.length) { safeResolve(); }
        }
      });
      const buffers = [20, 1000]; // time delay before/after in ms
      return new Promise((res, rej) => {
        setTimeout(() => {
          // execute the function to listen for and add a timeout
          promiseToListenFor().then(() => {
            return new Promise((done) => setTimeout(done, buffers[1]));
          }).then(res).catch(rej);
        }, buffers[0]);
      }).then(safeResolve).catch(reject);
    });
  };
}
