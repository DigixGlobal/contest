'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function setUp(type, _ref, handler) {
  var _ref2 = _slicedToArray(_ref, 4);

  var method = _ref2[0];
  var _statement = _ref2[1];
  var _samples = _ref2[2];
  var _transformers = _ref2[3];

  var statement = _statement;
  var samples = _samples || [];
  var transformers = _transformers || [];
  function promiseFactory() {
    return Promise.all(samples.map(function (sample) {
      var params = type !== 'assert' ? sample : sample[0] || [];
      var expected = type !== 'assert' ? null : sample[1] || [];
      var promise = method.call.apply(null, params);
      return handler({ promise: promise, params: params, expected: expected, transformers: transformers });
    }));
  }
  if (typeof statement !== 'string') {
    statement = null;
    samples = _statement || [];
    transformers = _samples || [];
    return promiseFactory();
  }
  return global.it(statement + ' x' + samples.length, promiseFactory);
}

var Contest = function () {
  function Contest() {
    _classCallCheck(this, Contest);
  }

  _createClass(Contest, [{
    key: 'assert',
    value: function assert() {
      for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
        opts[_key] = arguments[_key];
      }

      return setUp('assert', opts, function (_ref3) {
        var promise = _ref3.promise;
        var params = _ref3.params;
        var expected = _ref3.expected;
        var transformers = _ref3.transformers;

        return promise.then(function () {
          var res = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          var outputs = Array.isArray(res) ? res : [res];
          var expectedOutput = Array.isArray(expected) ? expected : [expected];
          expectedOutput.forEach(function (output, i) {
            var test = transformers[i] ? transformers[i](output, params) : output;
            global.assert.equal(test, outputs[i]);
          });
        }).catch(function (err) {
          return global.assert.ifError(err);
        });
      });
    }
  }, {
    key: 'throw',
    value: function _throw() {
      for (var _len2 = arguments.length, opts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        opts[_key2] = arguments[_key2];
      }

      return setUp('throw', opts, function (_ref4) {
        var promise = _ref4.promise;
        var params = _ref4.params;

        return promise.then(function () {
          return global.assert.ifError('did not throw: ' + JSON.stringify(params));
        }).catch(function (err) {
          return global.assert.ok(err);
        });
      });
    }
  }, {
    key: 'transact',
    value: function transact() {
      for (var _len3 = arguments.length, opts = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        opts[_key3] = arguments[_key3];
      }

      return setUp('transact', opts, function (_ref5) {
        var promise = _ref5.promise;

        return promise.then(function (tx) {
          return global.assert.ok(tx);
        }).catch(function (err) {
          return global.assert.ifError(err);
        });
      });
    }
  }, {
    key: 'listenFor',
    value: function listenFor() {}
  }, {
    key: 'stopListeningTo',
    value: function stopListeningTo() {}
  }]);

  return Contest;
}();

exports.default = Contest;