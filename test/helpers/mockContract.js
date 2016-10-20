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

export default {
  assertTxMethod: assertPromise,
  throwTxMethod: throwPromise,
  assertMethod: {
    call: assertPromise,
  },
  throwMethod: {
    call: throwPromise,
  },
};
