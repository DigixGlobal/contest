'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (args) {
  // ensure we have the method when it is required
  if (args.type === 'batch') {
    // do batch assert
    return (0, _test_methods.batch)(args);
  }
  // transaction or call type
  if (args.type === 'transaction' || args.type === 'call') {
    return (0, _test_methods2.default)(_extends({}, args));
  }
  // event type
  if (args.type === 'event') {
    return (0, _test_events2.default)(_extends({}, args));
  }
  return new Error('Invalid params');
};

var _test_events = require('./test_events');

var _test_events2 = _interopRequireDefault(_test_events);

var _test_methods = require('./test_methods');

var _test_methods2 = _interopRequireDefault(_test_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }