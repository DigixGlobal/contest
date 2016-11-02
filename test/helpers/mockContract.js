function throwPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Test Error');
    }, 10);
  });
}

function assertPromise(...args) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (args.length === 0) {
        return resolve(null);
      }
      if (args.length === 1) {
        return resolve(args[0]);
      }
      return resolve(args);
    }, 10);
  });
}

// TODO mock events
function eventAssertPromise(...args) {

}

export default {
  contract_name: 'MockContract',
  assertTxMethod: () => assertPromise('hash'),
  throwTxMethod: throwPromise,
  assertMethod: {
    call: assertPromise,
  },
  assertMethod1: { call: () => assertPromise(1) },
  assertMethod2: { call: () => assertPromise(2) },
  throwMethod: {
    call: throwPromise,
  },
  // TODO
  AssertEvent(settings) {
    // ({ fromBlock: 'latest' });
  },
  // ThrowEvent:
  triggerEvent(eventName, eventData) {
    // AssertEvent
  },
};
