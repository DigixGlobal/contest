"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncIterator = asyncIterator;
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