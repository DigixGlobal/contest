'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = parseOptions;
function parseOptions(_ref) {
  var _ref2 = _slicedToArray(_ref, 5);

  var method = _ref2[0];
  var _statement = _ref2[1];
  var _samples = _ref2[2];
  var _transformers = _ref2[3];
  var _beforeEventFn = _ref2[4];

  var args = {
    method: method,
    statement: _statement,
    samples: _samples || [],
    transformers: _transformers || [],
    beforeEventFn: _beforeEventFn
  };
  // remap arguments if statment is missing
  if (typeof args.statement !== 'string') {
    args.statement = null;
    args.samples = _statement || [];
    args.transformers = _transformers ? _samples : [];
    args.beforeEventFn = _transformers || _samples;
  } else {
    args.statement = args.samples.length > 1 ? args.statement + ' x' + args.samples.length : args.statement;
  }
  return args;
}