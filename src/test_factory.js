import testEvents from './test_events';
import testMethod, { batch } from './test_methods';

export default function (args) {
  // ensure we have the method when it is required
  if (args.type === 'batch') {
    // do batch assert
    return batch(args);
  }
  // transaction or call type
  if (args.type === 'transaction' || args.type === 'call') {
    return testMethod({ ...args });
  }
  // event type
  if (args.type === 'event') {
    return testEvents({ ...args });
  }
  return new Error('Invalid params');
}
