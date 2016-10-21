export default function parseOptions([method, _statement, _samples, _transformers, _beforeEventFn]) {
  const args = {
    method,
    statement: _statement,
    samples: _samples || [],
    transformers: _transformers || [],
    beforeEventFn: _beforeEventFn,
  };
  // remap arguments if statment is missing
  if (typeof args.statement !== 'string') {
    args.statement = null;
    args.samples = _statement || [];
    args.transformers = _transformers ? _samples : [];
    args.beforeEventFn = _transformers || _samples;
  } else {
    args.statement = args.samples.length > 1 ? `${args.statement} x${args.samples.length}` : args.statement;
  }
  return args;
}
