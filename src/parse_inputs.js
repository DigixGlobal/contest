export default function ([_methodName, _statement, _samples, _transformers], type) {
  // `statement` isn't a string, push latter values down
  const parsed = {
    methodName: _methodName,
    statement: _statement,
    samples: _samples,
    transformers: _transformers,
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
    parsed.samples = Object.keys(parsed.samples).map(key => [[key], [parsed.samples[key]]]);
  }
  // if method is null, we're working with a batch assert
  parsed.type = !parsed.methodName ? 'batch' : type || parsed.methodName.split(' ')[1] || 'call';
  parsed.methodName = parsed.methodName && parsed.methodName.split(' ')[0];
  parsed.expectThrow = parsed.statement.indexOf('throws ') === 0;
  return parsed;
}
