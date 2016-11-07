'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var samples = _ref.samples;
  var contract = _ref.contract;
  var methodName = _ref.methodName;
  var config = _ref.config;
  var _ref$transformers = _ref.transformers;
  var transformers = _ref$transformers === undefined ? [] : _ref$transformers;

  return function (promiseToListenFor) {
    return new Promise(function (resolve, reject) {
      var resolved = false;
      var i = 0;
      var watcher = contract()[methodName]('latest');
      function safeResolve() {
        if (!resolved) {
          resolved = true;
          watcher.stopWatching();
          _assert2.default.equal(i, samples.length, samples.length - i + ' events did not fire!');
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
              var eOutput = expectedOutput[key];
              // apply output transformer
              var output = transformers[key] ? transformers[key](result.args[key]) : result.args[key];
              if (config.debug) {
                console.log('assertEvent:', output, eOutput);
              }
              // apply input function
              try {
                if (typeof eOutput === 'function') {
                  return _assert2.default.equal(true, eOutput(output), eOutput);
                }
                return _assert2.default.equal(output, eOutput);
              } catch (e) {
                reject(e);
              }
            });
            // end when done
            if (i === samples.length) {
              safeResolve();
            }
          })();
        }
      });
      var buffers = [20, 1000]; // time delay before/after in ms
      return new Promise(function (res, rej) {
        setTimeout(function () {
          // execute the function to listen for and add a timeout
          promiseToListenFor().then(function () {
            return new Promise(function (done) {
              return setTimeout(done, buffers[1]);
            });
          }).then(res).catch(rej);
        }, buffers[0]);
      }).then(safeResolve).catch(reject);
    });
  };
};

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }