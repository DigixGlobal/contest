'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayify = arrayify;
function arrayify(sample) {
  if (sample === undefined) {
    return [];
  }
  console.log('isarray', Array.isArray(sample), sample);
  return Array.isArray(sample) ? sample : [sample];
}