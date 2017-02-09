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

var _test_dispatcher = require('./test_dispatcher');

var _test_dispatcher2 = _interopRequireDefault(_test_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contest = function () {
  function Contest() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$debug = _ref.debug;
    var debug = _ref$debug === undefined ? false : _ref$debug;
    var timeout = _ref.timeout;

    _classCallCheck(this, Contest);

    this.config = { debug: debug, timeout: timeout };
    this._contract = null;
    this._actionQueue = [];
    return this;
  }
  // for the new version of truffle....


  _createClass(Contest, [{
    key: 'artifact',
    value: function artifact(truffleArtifact) {
      var setContract = this._setContract.bind(this);
      this.describe('~~~ Contract: ' + truffleArtifact.toJSON().contract_name + ' ~~~\n');
      this.it('is deployed', function () {
        return truffleArtifact.deployed().then(function (instance) {
          _assert2.default.ok(instance.address);
          setContract(instance);
        });
      });
      return this;
    }
    // uses already-deployed contract

  }, {
    key: 'use',
    value: function use(contract) {
      // if we pass the text we create an upper level describe block
      if (!contract) {
        throw new Error('Contract not defined!');
      }
      var setContract = this._setContract.bind(this);
      this.describe(contract.contract_name);
      this.it('', function () {
        return new Promise(function (resolve) {
          _assert2.default.ok(contract.address);
          setContract(contract);
          resolve();
        });
      });
      return this;
    }
    // or deploy a new one

  }, {
    key: 'deploy',
    value: function deploy(newContract) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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
    // or pluck deployed one from truffle's global namespace

  }, {
    key: 'deployed',
    value: function deployed(contractName) {
      if (!contractName || global[contractName]) {
        throw new Error('Contract not defined!');
      }
      var setContract = this._setContract.bind(this);
      this.describe('Truffle deployment');
      this.it('is deployed', function () {
        return new Promise(function (resolve) {
          var contract = global[contractName].deployed();
          _assert2.default.ok(contract.address);
          setContract(contract);
          resolve();
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

      var type = args[args.length - 1].type;

      var opts = (0, _parse_inputs2.default)(args, type);
      var promise = (0, _test_dispatcher2.default)(_extends({}, opts, { config: config, contract: this._getContract.bind(this) }));
      this._addToQueue({ opts: opts, promise: promise });
      return this;
    }
  }, {
    key: 'tx',
    value: function tx() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this._.apply(this, [].concat(args, [{ type: 'transaction' }]));
    }
  }, {
    key: 'call',
    value: function call() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this._.apply(this, [].concat(args, [{ type: 'call' }]));
    }
  }, {
    key: 'watch',
    value: function watch() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this._.apply(this, [].concat(args, [{ type: 'event' }]));
    }
    // execute the current queue

  }, {
    key: 'done',
    value: function done() {
      var actions = this._actionQueue;
      this._actionQueue = [];
      if (!actions.length) {
        return this;
      }
      global.describe(this.describeBlock, function () {
        actions.forEach(function (fn) {
          if (fn.promise) {
            return null;
          }
          return fn();
        });
      });
      return this;
    }
  }, {
    key: 'it',
    value: function it(statement, promise) {
      this._addCustomAction({ statement: statement, promise: promise });
      return this;
    }
  }, {
    key: 'then',
    value: function then(promise) {
      this._addCustomAction({ promise: promise, type: 'then', before: true });
      return this;
    }

    // describe blocks set up a new `it` queue

  }, {
    key: 'describe',
    value: function describe(statement) {
      this.done();
      this.describeBlock = statement;
      return this;
    }
  }, {
    key: '_addCustomAction',
    value: function _addCustomAction(_ref2) {
      var _this = this;

      var statement = _ref2.statement;
      var _promise = _ref2.promise;
      var type = _ref2.type;
      var before = _ref2.before;

      this._addToQueue({
        promise: function promise() {
          // resolve promise or promisify regular functions
          return new Promise(function (resolve, reject) {
            var p = _promise(_this._getContract());
            if (p && p.then) {
              return p.then(resolve).catch(reject);
            }
            return resolve();
          });
        },
        opts: {
          statement: statement,
          type: type,
          before: before
        }
      });
    }
    // internal queue method

  }, {
    key: '_addToQueue',
    value: function _addToQueue(_ref3) {
      var opts = _ref3.opts;
      var promise = _ref3.promise;
      var type = opts.type;
      var statement = opts.statement;
      var before = opts.before;

      var eventObj = { promise: promise, type: type, statement: statement, before: before };
      var previousAction = this._actionQueue[this._actionQueue.length - 1] || {};
      if (previousAction.type === 'event' && eventObj.type !== 'transaction') {
        throw new Error('`watch` must be followed by `tx`!');
      }
      if (previousAction.before) {
        // previous action should can executed in series
        eventObj.promise = function (args) {
          return new Promise(function (resolve, reject) {
            // pass up the assersion failure
            previousAction.promise().catch(reject).then(function () {
              return promise(args).catch(reject);
            }).then(resolve).catch(reject);
          });
        };
        // if this item is an event or then, overwrite previous.
        if (eventObj.before || eventObj.type === 'event') {
          this._actionQueue[this._actionQueue.length - 1] = eventObj;
          return this;
        }
      }
      // if we are then, but previous wasn't, push a new block
      if (eventObj.before || eventObj.type === 'event') {
        // TODO do something if prev action is event?
        this._actionQueue.push(eventObj);
        return this;
      }
      var timeout = this.config.timeout;
      // ensure events create an it statement

      if (previousAction.type === 'event') {
        this._actionQueue[this._actionQueue.length - 1] = function () {
          global.it(previousAction.statement + ' & ' + statement, function () {
            if (timeout) {
              this.timeout(timeout);
            }
            return previousAction.promise(eventObj.promise);
          });
        };
        return this;
      }
      // default action
      this._actionQueue.push(function () {
        global.it(statement, function () {
          if (timeout) {
            this.timeout(timeout);
          }
          return eventObj.promise();
        });
      });

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