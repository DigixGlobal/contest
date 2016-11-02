import parser from './parser';
import tester from './tester';
// import deploy from './deploy';

export default class Contest {
  constructor({ defaultParams = {}, debug = false } = {}) {
    // this.promise = promise;
    // this.promise = this;
    this.contractOptions = defaultParams;
    this.debug = debug;
    // this.debug = debug;
    this.describeQueue = [];
    this.itQueue = [];

    // each block is a describe block with a bunch of `it` statements
    // at the end of the promise queue, we want to call all our blocks, with a description
    // describe key .....
    return this;
  }
  done() {
    this.executeChain();
    // // allow it to execute the shit at the end!
    // console.log("we done!", this.deferred);
    // const deferred = this.deferred;
    // console.log('got deferred', deferred)
    return this.deferred;
  }
  _(_method, _statment, _samples, _transformers) {
    // pass statment and method to parser
    const { contract } = this;
    const options = parser({ statement, samples });
    const tests = tester.apply(this, [{ contract, options, samples, transformers }]);
    if (!this.contract) { throw new Error('Contract not deployed!'); }
    this.itQueue.push(function () {
      global.it(options.statement, function () {
        return tests();
      });
    });
    return this;
  }
  registerAction(action) {
    this.itQueue.push(action);
  }
  executeChain() {
    const actions = this.itQueue;
    if (!actions.length) { return; }
    global.describe(this.describeBlock, function () {
      actions.forEach(fn => fn());
    });
  }
  // describe blocks set up a new subchain
  describe(statement) {
    this.executeChain();
    this.describeBlock = statement;
    this.itQueue = [];
    return this;
  }
  // deploy deploys sets up a new contract instance
  deploy(newContract, optionalText) {
    // should be a before block ?
    const { contract } = this;
    if (!newContract && !contract) { throw new Error('Contract not defined!'); }
    // TODO Contract.new()...
    // TODO this.contract =

    // use the thing

    // otherwise let's deploy this bizatch
    return this;
  }
  // uses already-deployed contract
  use(contract, optionalText) {
    // if we pass the text we create an upper level describe block
    if (!contract) { throw new Error('Contract not defined!'); }
    this.contract = contract;
    return this;
  }
  // as(args) {
  //   // add action, set the user
  //   this.set({ from: [] })
  //   return this;
  // }
  set(args) {
    this.contractOptions = { ...this.state, ...args };
  }
}
