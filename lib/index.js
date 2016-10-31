'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _methodTester = require('./methodTester');

var _methodTester2 = _interopRequireDefault(_methodTester);

var _eventTester = require('./eventTester');

var _eventTester2 = _interopRequireDefault(_eventTester);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noThrowError = 'Method invocation did not cause an error';

var Contest = function () {
  function Contest() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Contest);

    this.debug = opts.debug;
  }

  _createClass(Contest, [{
    key: 'suite',
    value: function suite(method, _describe, _tests) {
      var _this = this;

      var describe = !_tests ? null : _describe;
      var tests = !_tests ? _describe : _tests;
      var runTests = function runTests() {
        return tests.forEach(function (test) {
          var _test = _toArray(test);

          var descriptor = _test[0];

          var args = _test.slice(1);

          var testType = descriptor.split(' ').shift();
          var statement = descriptor.split(' ').slice(1).join(' ').trim() || undefined;
          var testParams = [method, statement].concat(_toConsumableArray(args));
          return _this[testType].apply(_this, _toConsumableArray(testParams));
        });
      };
      if (describe) {
        global.describe(describe, runTests);
      } else {
        runTests();
      }
      return this;
    }
  }, {
    key: 'values',
    value: function values(contract, statement, _values) {
      var _this2 = this;

      var keys = Object.keys(_values);
      return global.describe(statement, function () {
        return keys.forEach(function (key) {
          var method = contract[key];
          var expected = _values[key].value || _values[key];
          var transform = _values[key].transform;
          return _this2.assert(method, key, [[[], expected]], transform);
        });
      });
    }
  }, {
    key: 'assert',
    value: function assert() {
      var _this3 = this;

      for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
        opts[_key] = arguments[_key];
      }

      return (0, _methodTester2.default)('assert', opts, function (_ref) {
        var promise = _ref.promise;
        var params = _ref.params;
        var expected = _ref.expected;
        var transformers = _ref.transformers;

        return promise.then(function () {
          var res = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          // allow flexibility with array
          var outputs = Array.isArray(res) ? res : [res];
          var expectedOutputs = Array.isArray(expected) ? expected : [expected];
          expectedOutputs.forEach(function (expectedOutput, i) {
            // tranform output
            var transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
            // transform expected output
            if (typeof expectedOutput === 'function') {
              if (_this3.debug) {
                console.log('assert equal:', transformedOutput, expectedOutput);
              }
              return global.assert.equal(true, expectedOutput(transformedOutput));
              // no transformers set, expected output is a number, and we can transform it
            } else if (!transformers[i] && !isNaN(expectedOutput) && transformedOutput.toNumber) {
              // automatically transform bignumbers
              transformedOutput = transformedOutput.toNumber();
            }
            // log if debug enabled
            if (_this3.debug) {
              console.log('assert:', transformedOutput, expectedOutput);
            }
            // do the test
            return global.assert.equal(transformedOutput, expectedOutput);
          });
        }).catch(function (err) {
          if (_this3.debug) {
            console.log('TEST FAILURE: ', err);
          }
          return global.assert.ifError(new Error(err));
        });
      });
    }
  }, {
    key: 'assertTx',
    value: function assertTx() {
      var _this4 = this;

      for (var _len2 = arguments.length, opts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        opts[_key2] = arguments[_key2];
      }

      return (0, _methodTester2.default)('transact', opts, function (_ref2) {
        var promise = _ref2.promise;

        return promise.then(function (tx) {
          if (_this4.debug) {
            console.log('assertTx:', tx);
          }
          return global.assert.ok(tx);
        }).catch(function (err) {
          if (_this4.debug) {
            console.log('TEST FAILURE: it threw');
          }
          return global.assert.ifError(new Error(err));
        });
      });
    }
  }, {
    key: 'throw',
    value: function _throw() {
      for (var _len3 = arguments.length, opts = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        opts[_key3] = arguments[_key3];
      }

      return (0, _methodTester2.default)('throw', opts, this._throwCatcher());
    }
  }, {
    key: 'throwTx',
    value: function throwTx() {
      for (var _len4 = arguments.length, opts = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        opts[_key4] = arguments[_key4];
      }

      return (0, _methodTester2.default)('transact', opts, this._throwCatcher());
    }
  }, {
    key: 'assertEvent',
    value: function assertEvent() {
      for (var _len5 = arguments.length, opts = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        opts[_key5] = arguments[_key5];
      }

      return (0, _eventTester2.default)(opts, this._eventAsserter(true));
    }
  }, {
    key: 'throwEvent',
    value: function throwEvent() {
      for (var _len6 = arguments.length, opts = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        opts[_key6] = arguments[_key6];
      }

      return (0, _eventTester2.default)(opts, this._eventAsserter(false));
    }
  }, {
    key: '_throwCatcher',
    value: function _throwCatcher() {
      var _this5 = this;

      return function (_ref3) {
        var promise = _ref3.promise;

        return promise.then(function () {
          if (_this5.debug) {
            console.log('TEST FAILURE: did not throw');
          }
          throw new Error(noThrowError);
        }).catch(function (err) {
          if (err.message === noThrowError) {
            throw err;
          }
          if (_this5.debug) {
            console.log('throw:', err);
          }
          return global.assert.ok(err);
        });
      };
    }
  }, {
    key: '_eventAsserter',
    value: function _eventAsserter(assert) {
      var _this6 = this;

      return function (output, expectedOutput) {
        if (_this6.debug) {
          console.log('assertEvent:', output, expectedOutput);
        }
        // apply input function
        if (typeof expectedOutput === 'function') {
          return global.assert.equal(expectedOutput(output), true);
        }
        return global.assert[assert ? 'equal' : 'notEqual'](output, expectedOutput);
      };
    }
  }]);

  return Contest;
}();

exports.default = Contest;