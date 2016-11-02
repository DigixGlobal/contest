// import testEvents from './test_events';
import testMethod, { batch } from './test_methods';

function batchAssert(args) {
  console.log('batching', args);
}

export default function (args) {
  // ensure we have the method when it is required
  if (args.type === 'batch') {
    // do batch assert
    return batch(args);
  }
  // not a batch, we can define the method now
  const method = args.contract[args.methodName];
  // throw if it's not set
  if(!method) {
    throw new Error(`Method ${args.methodName} not found on contract ${args.contract.contract_name}`)
  }
  // transaction or call type
  if (args.type === 'transaction' || args.type === 'call') {
    return testMethod({ ...args, method });
  }
  // event type
  // if (type === 'event') {
  //   return testEvents({ ...args, method });
  // }
  return new Error('Invalid params');
}
