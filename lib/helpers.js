'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ONE_DAY_IN_SECONDS = exports.BIG_INT_MINUS_TWO = exports.BIG_INT = undefined;
exports.asyncIterator = asyncIterator;
exports.randomInt = randomInt;
exports.randomHex = randomHex;
exports.randomAddress = randomAddress;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// some helper values
var BIG_INT = exports.BIG_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
var BIG_INT_MINUS_TWO = exports.BIG_INT_MINUS_TWO = '115792089237316195423570985008687907853269984665640564039457584007913129639933';
var ONE_DAY_IN_SECONDS = exports.ONE_DAY_IN_SECONDS = 60 * 60 * 24;

function asyncIterator(data, fn, done) {
  var i = 0;
  function iterate() {
    fn(data[i], function () {
      i++;
      if (i > data.length - 1) {
        done();
      } else {
        iterate();
      }
    });
  }
  iterate();
}

function randomInt(min, max) {
  var rand = Math.round(Math.random() * max);
  return min + rand;
}

function randomHex(len, prefix) {
  return '' + (prefix ? '0x' : '') + _crypto2.default.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

function randomAddress(prefix) {
  return randomHex(40, prefix);
}