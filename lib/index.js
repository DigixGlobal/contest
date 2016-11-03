'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _parse_inputs = require('./parse_inputs');

var _parse_inputs2 = _interopRequireDefault(_parse_inputs);

var _test_factory = require('./test_factory');

var _test_factory2 = _interopRequireDefault(_test_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import deploy from './deploy';

var Contest = function () {
  function Contest() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$debug = _ref.debug;
    var debug = _ref$debug === undefined ? false : _ref$debug;

    _classCallCheck(this, Contest);

    this.config = { debug: debug };
    this._contract = null;
    this._actionQueue = [];
    return this;
  }
  // uses already-deployed contract


  _createClass(Contest, [{
    key: 'use',
    value: function use(contract) {
      // if we pass the text we create an upper level describe block
      if (!contract) {
        throw new Error('Contract not defined!');
      }
      var setContract = this._setContract.bind(this);
      this.describe(contract.contract_name);
      this.it('', function () {
        _assert2.default.ok(contract.address);
        setContract(contract);
      });
      return this;
    }
    // or deploy a new one

  }, {
    key: 'deploy',
    value: function deploy(newContract) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      // let's deploy this bizatch
      var setContract = this._setContract.bind(this);
      this.describe(newContract.contract_name);
      this.it('deploys', function () {
        return newContract.new.apply(newContract, args).then(function (contract) {
          _assert2.default.ok(contract.address);
          setContract(contract);
        }).catch(function (err) {
          return _assert2.default.ifError(err);
        });
      });
      return this;
    }
    // pass statment and method to parser

  }, {
    key: '_',
    value: function _() {
      var config = this.config;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var opts = (0, _parse_inputs2.default)(args);
      var promise = (0, _test_factory2.default)(_extends({}, opts, { config: config, contract: this._getContract.bind(this) }));
      this._addToQueue({ opts: opts, promise: promise });
      return this;
    }
    // execute the current queue

  }, {
    key: 'done',
    value: function done() {
      var actions = this._actionQueue;
      if (!actions.length) {
        return this;
      }
      global.describe(this.describeBlock, function () {
        actions.forEach(function (fn) {
          return fn.promise ? fn.promise() : fn();
        });
      });
      return this;
    }
  }, {
    key: 'it',
    value: function it(statement, promise) {
      this._addCustomAction(statement, promise);
      return this;
    }
  }, {
    key: 'before',
    value: function before(promise) {
      this._addCustomAction(null, promise, 'before');
      return this;
    }
    // describe blocks set up a new `it` queue

  }, {
    key: 'describe',
    value: function describe(statement) {
      this.done();
      this.describeBlock = statement;
      this._actionQueue = [];
      return this;
    }
  }, {
    key: '_addCustomAction',
    value: function _addCustomAction(statement, _promise, type) {
      var _this = this;

      this._addToQueue({
        promise: function promise() {
          return _promise(_this._getContract());
        },
        opts: {
          statement: statement,
          type: type
        }
      });
    }
    // internal queue method

  }, {
    key: '_addToQueue',
    value: function _addToQueue(_ref2) {
      var _this2 = this;

      var opts = _ref2.opts;
      var promise = _ref2.promise;

      // deal with things that should be merged into preceeding test
      if (opts.type === 'event' || opts.type === 'before') {
        this._actionQueue.push({ promise: promise, before: true, statement: opts.statement });
      } else {
        (function () {
          // replace last action if it is an event
          var previousAction = _this2._actionQueue[_this2._actionQueue.length - 1] || {};
          if (previousAction.before) {
            // if the previous _actionQueue item is an event, pass it this test instead.
            _this2._actionQueue[_this2._actionQueue.length - 1] = function () {
              var previousStatement = previousAction.statement ? previousAction.statement + ' & ' : '';
              global.it('' + previousStatement + opts.statement, function () {
                return previousAction.promise(promise);
              });
            };
          } else {
            // no previous events, just pass the promise
            _this2._actionQueue.push(function () {
              global.it(opts.statement, function () {
                return promise();
              });
            });
          }
        })();
      }
      return this;
    }
    // return current instance of contract

  }, {
    key: '_getContract',
    value: function _getContract() {
      return this._contract;
    }
    // set contract instance

  }, {
    key: '_setContract',
    value: function _setContract(contract) {
      this._contract = contract;
    }
  }]);

  return Contest;
}();

exports.default = Contest;