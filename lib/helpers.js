"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayify = arrayify;
function arrayify(sample) {
  if (sample === undefined) {
    return [];
  }
  return Array.isArray(sample) ? sample : [sample];
}