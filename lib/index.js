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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contest = function () {
  function Contest() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Contest);

    this.debug = opts.debug;
  }

  _createClass(Contest, [{
    key: 'assert',
    value: function assert() {
      var _this = this;

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

          var outputs = Array.isArray(res) ? res : [res];
          var expectedOutput = Array.isArray(expected) ? expected : [expected];
          expectedOutput.forEach(function (eOutput, i) {
            var transformedOutput = transformers[i] ? transformers[i](outputs[i], params) : outputs[i];
            if (_this.debug) {
              console.log('assert:', transformedOutput, eOutput);
            }
            return global.assert.equal(transformedOutput, eOutput);
          });
        }).catch(function (err) {
          if (_this.debug) {
            console.log('TEST FAILURE: ', err);
          }
          return global.assert.ifError(err);
        });
      });
    }
  }, {
    key: 'throw',
    value: function _throw() {
      var _this2 = this;

      for (var _len2 = arguments.length, opts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        opts[_key2] = arguments[_key2];
      }

      return (0, _methodTester2.default)('throw', opts, function (_ref2) {
        var promise = _ref2.promise;
        var params = _ref2.params;

        return promise.then(function () {
          if (_this2.debug) {
            console.log('TEST FAILURE: did not throw');
          }
          return global.assert.ifError('did not throw: ' + JSON.stringify(params));
        }).catch(function (err) {
          if (_this2.debug) {
            console.log('throw:', err);
          }
          return global.assert.ok(err);
        });
      });
    }
  }, {
    key: 'assertTx',
    value: function assertTx() {
      var _this3 = this;

      for (var _len3 = arguments.length, opts = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        opts[_key3] = arguments[_key3];
      }

      return (0, _methodTester2.default)('transact', opts, function (_ref3) {
        var promise = _ref3.promise;

        return promise.then(function (tx) {
          if (_this3.debug) {
            console.log('assertTx:', tx);
          }
          return global.assert.ok(tx);
        }).catch(function (err) {
          if (_this3.debug) {
            console.log('TEST FAILURE: did not throw');
          }
          return global.assert.ifError(err);
        });
      });
    }
  }, {
    key: 'throwTx',
    value: function throwTx() {
      var _this4 = this;

      for (var _len4 = arguments.length, opts = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        opts[_key4] = arguments[_key4];
      }

      return (0, _methodTester2.default)('transact', opts, function (_ref4) {
        var promise = _ref4.promise;
        var params = _ref4.params;

        return promise.then(function () {
          if (_this4.debug) {
            console.log('TEST FAILURE: did not throw');
          }
          return global.assert.ifError('did not throw: ' + JSON.stringify(params));
        }).catch(function (err) {
          if (_this4.debug) {
            console.log('throwTx:', err);
          }
          return global.assert.ok(err);
        });
      });
    }
  }, {
    key: 'assertEvent',
    value: function assertEvent() {
      var _this5 = this;

      for (var _len5 = arguments.length, opts = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        opts[_key5] = arguments[_key5];
      }

      return (0, _eventTester2.default)(opts, function (output, expectedOutput) {
        if (_this5.debug) {
          console.log('assertEvent:', output, expectedOutput);
        }
        console.log('assertEvent:', output, expectedOutput);
        // apply input function
        if (typeof expectedOutput === 'function') {
          return global.assert.equal(expectedOutput(output), true);
        }
        return global.assert.equal(output, expectedOutput);
      });
    }
  }, {
    key: 'throwEvent',
    value: function throwEvent() {
      var _this6 = this;

      for (var _len6 = arguments.length, opts = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        opts[_key6] = arguments[_key6];
      }

      return (0, _eventTester2.default)(opts, function (output, expectedOutput) {
        if (_this6.debug) {
          console.log('throwEvent:', output, expectedOutput);
        }
        // apply input function
        if (typeof expectedOutput === 'function') {
          return global.assert.equal(expectedOutput(output), false);
        }
        return global.assert.notEqual(output, expectedOutput);
      });
    }
  }]);

  return Contest;
}();

exports.default = Contest;