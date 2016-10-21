'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eventTester;

var _parseOptions2 = require('./parseOptions');

var _parseOptions3 = _interopRequireDefault(_parseOptions2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function eventTester(opts, handler) {
  var _parseOptions = (0, _parseOptions3.default)(opts);

  var method = _parseOptions.method;
  var statement = _parseOptions.statement;
  var samples = _parseOptions.samples;
  var transformers = _parseOptions.transformers;
  var beforeEventFn = _parseOptions.beforeEventFn;
  var timeout = _parseOptions.timeout;

  function promiseFactory() {
    return new Promise(function (resolve) {
      var watcher = method({ fromBlock: 'latest' });
      var resolved = false;
      var i = 0;
      function safeResolve() {
        if (!resolved) {
          resolved = true;
          watcher.stopWatching();
          global.assert.equal(i, samples.length, samples.length - i + ' events did not fire!');
          resolve();
        }
      }
      watcher.watch(function (error, result) {
        if (!error && !resolved) {
          (function () {
            i++;
            // run the assert for each output
            var expectedOutput = samples[i - 1];
            Object.keys(expectedOutput).forEach(function (key) {
              // apply output transformer
              var output = transformers[key] ? transformers[key](result.args[key]) : result.args[key];
              handler(output, expectedOutput[key]);
            });
            // end when done
            if (i === samples.length) {
              safeResolve();
            }
          })();
        }
      });
      // execute the function to listen for and add a timeout
      console.log('executing...', beforeEventFn);
      return beforeEventFn().then(function () {
        return new Promise(function (done) {
          return setTimeout(done, timeout || 600);
        });
      }).then(safeResolve);
    });
  }
  console.log('wrapping it?', !!statement);
  return statement ? global.it(statement, promiseFactory) : promiseFactory();
}