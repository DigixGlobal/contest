const keyPhrases = {
  ' call throws ': {
    type: 'call',
    throw: true,
  },
  ' call ': {
    type: 'call',
  },
  ' transacts ': {
    type: 'transaction',
  },
  ' transaction throws ': {
    type: 'transaction',
    throw: true,
  },
  ' fires ': {
    type: 'event',
  },
  ' does not fire ': {
    type: 'event',
    throw: true,
  },
  'values are correct when': {
    type: 'batchAssert',
  },
};

export default function ({ statement }) {
  const matchedPhrase = Object.keys(keyPhrases).find(key => statement.includes(key));
  const splitStatement = statement.split(matchedPhrase);
  const method = splitStatement[0].trim() || undefined;
  const options = keyPhrases[matchedPhrase];
  if (!options) { throw new Error(`Invalid Params: ${statement}`); }
  const statementPrefix = options.throw ? 'throws ' : '';
  const newStatement = `${method} ${statementPrefix}${splitStatement[1].trim()}`;
  // TODO throw on not valid
  return { ...options, method, statement: newStatement };
}
