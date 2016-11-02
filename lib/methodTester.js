'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = methodTester;

var _parseOptions2 = require('./parseOptions');

var _parseOptions3 = _interopRequireDefault(_parseOptions2);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function methodTester(type, opts, handler) {
  var _parseOptions = (0, _parseOptions3.default)(opts);

  var method = _parseOptions.method;
  var statement = _parseOptions.statement;
  var samples = _parseOptions.samples;
  var transformers = _parseOptions.transformers;

  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      var params = type !== 'assert' ? (0, _helpers.arrayify)(sample) : (0, _helpers.arrayify)(sample[0]);
      var expected = type !== 'assert' ? [] : (0, _helpers.arrayify)(sample[1]);
      var fn = type !== 'transact' ? method.call : method;
      var promise = fn.apply(undefined, _toConsumableArray(params));
      return handler({ promise: promise, params: params, expected: expected, transformers: transformers });
    }));
  }
  return statement ? global.it(statement, promiseFactory) : promiseFactory();
}