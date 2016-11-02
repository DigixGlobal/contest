'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _tester = require('./tester');

var _tester2 = _interopRequireDefault(_tester);

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
    this.describeQueue = [];
    this.itQueue = [];
    return this;
  }

  _createClass(Contest, [{
    key: 'done',
    value: function done() {
      this.executeChain();
      return this;
    }
  }, {
    key: '_',
    value: function _() {
      // if sample is an object, transform them
      // pass statment and method to parser
      var contract = this.contract;
      var config = this.config;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var opts = (0, _parser2.default)(args);
      var tests = (0, _tester2.default)(_extends({}, opts, { config: config, contract: contract }));
      if (!this.contract) {
        throw new Error('Contract not deployed!');
      }
      this.itQueue.push(function () {
        global.it(opts.statement, function () {
          return tests();
        });
      });
      return this;
    }
  }, {
    key: 'executeChain',
    value: function executeChain() {
      var actions = this.itQueue;
      if (!actions.length) {
        return;
      }
      global.describe(this.describeBlock, function () {
        actions.forEach(function (fn) {
          return fn();
        });
      });
    }
    // describe blocks set up a new subchain

  }, {
    key: 'describe',
    value: function describe(statement) {
      this.executeChain();
      this.describeBlock = statement;
      this.itQueue = [];
      return this;
    }
    // deploy deploys sets up a new contract instance

  }, {
    key: 'deploy',
    value: function deploy(newContract, optionalText) {
      // should be a before block ?
      var contract = this.contract;

      if (!newContract && !contract) {
        throw new Error('Contract not defined!');
      }
      // TODO Contract.new()...
      // TODO this.contract =

      // use the thing

      // otherwise let's deploy this bizatch
      return this;
    }
    // uses already-deployed contract

  }, {
    key: 'use',
    value: function use(contract, optionalText) {
      // if we pass the text we create an upper level describe block
      if (!contract) {
        throw new Error('Contract not defined!');
      }
      this.contract = contract;
      return this;
    }
    // as(args) {
    //   // add action, set the user
    //   this.set({ from: [] })
    //   return this;
    // }
    // set(args) {
    //   this.contractOptions = { ...this.state, ...args };
    // }

  }]);

  return Contest;
}();

exports.default = Contest;