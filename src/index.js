import parser from './parser';
import tester from './tester';
// import deploy from './deploy';

export default class Contest {
  constructor({ debug = false } = {}) {
    this.config = { debug };
    this.describeQueue = [];
    this.itQueue = [];
    return this;
  }
  done() {
    this.executeChain();
    return this;
  }
  _(...args) {
    // if sample is an object, transform them
    // pass statment and method to parser
    const { contract, config } = this;
    const opts = parser(args);
    const tests = tester({ ...opts, config, contract });
    if (!this.contract) { throw new Error('Contract not deployed!'); }
    this.itQueue.push(function () {
      global.it(opts.statement, function () { return tests(); });
    });
    return this;
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
  // set(args) {
  //   this.contractOptions = { ...this.state, ...args };
  // }
}
