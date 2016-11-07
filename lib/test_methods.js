'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.batch = batch;

exports.default = function (args) {
  // now do them in series
  return function () {
    return new Promise(function (resolve, reject) {
      var contract = args.contract;
      var methodName = args.methodName;
      var type = args.type;
      var expectThrow = args.expectThrow;

      var method = contract()[methodName];
      var fn = type === 'transaction' ? method : method.call;
      var assersion = type === 'transaction' ? assertTransaction : assertCall;
      if (expectThrow) {
        assersion = throwCatcher;
      }
      var tests = parseSamples(args);
      (0, _helpers.asyncIterator)(tests, function (_ref6, callback) {
        var params = _ref6.params;
        var expected = _ref6.expected;

        var promise = fn.apply(undefined, _toConsumableArray(params));
        assersion(_extends({}, args, { promise: promise, params: params, expected: expected })).then(callback).catch(reject);
      }, resolve);
    });
  };
};

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function assertCall(_ref) {
  var config = _ref.config;
  var promise = _ref.promise;
  var params = _ref.params;
  var _ref$expected = _ref.expected;
  var expected = _ref$expected === undefined ? [] : _ref$expected;
  var _ref$transformers = _ref.transformers;
  var transformers = _ref$transformers === undefined ? [] : _ref$transformers;

  return promise.then(function (outs) {
    var outputs = Array.isArray(outs) ? outs : [outs];
    expected.forEach(function (expectedOutput, i) {
      // tranform output
      var transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
      // transform expected output
      if (typeof expectedOutput === 'function') {
        if (config.debug) {
          console.log('assert equal:', transformedOutput, expectedOutput);
        }
        return _assert2.default.equal(true, expectedOutput(transformedOutput), expectedOutput);
        // no transformers set, expected output is a number, and we can transform it
      } else if (!transformers[i] && !isNaN(expectedOutput) && transformedOutput && transformedOutput.toNumber) {
        // automatically transform bignumbers
        transformedOutput = transformedOutput.toNumber();
      }
      // log if debug enabled
      if (config.debug) {
        console.log('assert:', transformedOutput, expectedOutput);
      }
      // do the test
      return _assert2.default.equal(transformedOutput, expectedOutput);
    });
  }).catch(function (err) {
    if (config.debug) {
      console.log('TEST FAILURE: ', err);
    }
    return _assert2.default.ifError(new Error(err));
  });
}

function assertTransaction(_ref2) {
  var promise = _ref2.promise;
  var config = _ref2.config;

  return promise.then(function (tx) {
    if (config.debug) {
      console.log('assertTx:', tx);
    }
    return _assert2.default.ok(tx);
  }).catch(function (err) {
    if (config.debug) {
      console.log('TEST FAILURE: it threw', err);
    }
    return _assert2.default.ifError(new Error(err));
  });
}

function throwCatcher(_ref3) {
  var promise = _ref3.promise;
  var config = _ref3.config;

  return promise.then(function () {
    if (config.debug) {
      console.log('TEST FAILURE: Expected throw but did not throw');
    }
    throw new Error('Expected Throw');
  }).catch(function (err) {
    if (err.message === 'Expected Throw') {
      throw err;
    }
    if (config.debug) {
      console.log('throw:', err);
    }
    return _assert2.default.ok(err);
  });
}

function parseSamples(_ref4) {
  var samples = _ref4.samples;
  var expectThrow = _ref4.expectThrow;
  var type = _ref4.type;

  var altApi = type === 'call' && !expectThrow;
  var testSamples = samples;
  // standardised sample formats; convert single array into nested array
  if (!altApi) {
    if (!samples) {
      testSamples = [[]];
    } else if (!altApi && !Array.isArray(samples[0])) {
      testSamples = [samples];
    }
  } else {
    // using alternative API
    if (!samples) {
      testSamples = [[[], []]];
    } else if (!Array.isArray(samples[0][0])) {
      testSamples = [samples];
    } else {
      testSamples = samples;
    }
  }
  return testSamples.map(function (sample) {
    var params = !altApi ? sample : sample[0];
    var expected = !altApi ? [] : sample[1];
    return { params: params, expected: expected };
  });
}

function batch(args) {
  return function () {
    return new Promise(function (resolve, reject) {
      var samples = args.samples;
      var contract = args.contract;

      var contractInstance = contract();
      var tests = Object.keys(samples).map(function (key) {
        return {
          method: contractInstance[key].call,
          params: [],
          expected: [samples[key]]
        };
      });
      (0, _helpers.asyncIterator)(tests, function (_ref5, callback) {
        var method = _ref5.method;
        var params = _ref5.params;
        var expected = _ref5.expected;

        var promise = method.apply(undefined, _toConsumableArray(params));
        assertCall(_extends({}, args, { promise: promise, params: params, expected: expected })).then(callback).catch(reject);
      }, resolve);
    });
  };
}