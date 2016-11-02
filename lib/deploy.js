'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var contract = this.contract;

  if (!contract) {
    throw new Error('Contract not defined!');
  }
  // otherwise let's deploy this bizatch
  return this;
};