const EventEmitter = require('events');
const myEmitter = new EventEmitter();

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

const mock = {
  address: '0xdeadbeef',
  contract_name: 'MockContract',
  assertTxMethod: () => assertPromise('hash'),
  throwTxMethod: throwPromise,
  assertMethod: {
    call: assertPromise,
  },
  assertMethod1: { call: () => assertPromise(1) },
  assertMethod2: { call: () => assertPromise(2) },
  eventMethod: (...args) => {
    return new Promise((resolve) => {
      assertPromise(...args)
      .then(() => myEmitter.emit('event', args))
      .then(resolve)
    });
  },
  throwMethod: {
    call: throwPromise,
  },
  AssertEvent() {
    let watching;
    let callback = () => {};
    const emit = function (data) {
      if (callback && watching) {
        const transformedData = {};
        data.forEach((i, j) => { transformedData[j] = i; });
        callback(null, { args: transformedData });
      }
    };
    myEmitter.on('event', emit);
    return {
      watch(cb) {
        watching = true;
        callback = cb;
      },
      stopWatching() {
        watching = false;
      },
    };
  },
};

export const instantiator = {
  contract_name: 'MockContract',
  new: (name) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mock, testName: name }), 100);
    });
  },
};

export default mock;
