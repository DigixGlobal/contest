'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (_ref) {
  var _ref2 = _slicedToArray(_ref, 4);

  var _methodName = _ref2[0];
  var _statement = _ref2[1];
  var _samples = _ref2[2];
  var _transformers = _ref2[3];

  // `statement` isn't a string, push latter values down
  var parsed = {
    methodName: _methodName,
    statement: _statement,
    samples: _samples,
    transformers: _transformers
  };
  // if statement isn't a string, push arguments left
  if (typeof _statement !== 'string') {
    parsed.methodName = null;
    parsed.statement = _methodName;
    parsed.samples = _statement;
    parsed.transformers = _transformers;
  }

  // if method set and samples are an object, transform to array
  if (parsed.methodName && parsed.samples && !Array.isArray(parsed.samples)) {
    parsed.samples = Object.keys(parsed.samples).map(function (key) {
      return [[key], [parsed.samples[key]]];
    });
  }
  // if method is null, we're working with a batch assert
  parsed.type = !parsed.methodName ? 'batch' : parsed.methodName.split(' ')[1] || 'call';
  parsed.methodName = parsed.methodName && parsed.methodName.split(' ')[0];
  parsed.expectThrow = parsed.statement.indexOf('throws ') === 0;
  return parsed;
};