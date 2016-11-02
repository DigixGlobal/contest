// import testEvents from './test_events';
import testMethod from './test_methods';

function batchAssert(args) {
  console.log('batching', args);
}

export default function (args) {
  const { contract, options } = args;
  // ensure we have the method when it is required
  if (options.type === 'batchAssert') {
    // do batch assert
    return batchAssert();
  }
  if (!options.method || !contract[options.method]) {
    throw new Error(`Method '${options.method}' not found on '${contract.contract_name}'`);
  }
  const method = contract[options.method];
  // events
  // if (options.type === 'event') {
  //   return testEvents({ ...args, method });
  // }
  // methods, determine assersion type..
  if (options.type === 'transaction' || options.type === 'call') {
    return testMethod.apply(this, [{ ...args, method }]);
  }
  return new Error('Invalid params');
}
