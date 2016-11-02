import parser from './parse_inputs';
import tester from './test_factory';
// import deploy from './deploy';

export default class Contest {
  constructor({ debug = false } = {}) {
    this.config = { debug };
    this.actionQueue = [];
    return this;
  }
  _(...args) {
    // pass statment and method to parser
    const { contract, config } = this;
    if (!contract) { throw new Error('Contract not set!'); }
    const opts = parser(args);
    const tests = tester({ ...opts, config, contract });
    this._addToQueue({ opts, tests });
    return this;
  }
  done() {
    const actions = this.actionQueue;
    if (!actions.length) { return this; }
    global.describe(this.describeBlock, function () {
      actions.forEach(fn => fn());
    });
    return this;
  }
  // describe blocks set up a new `it` queue
  describe(statement) {
    this.done();
    this.describeBlock = statement;
    this.actionQueue = [];
    return this;
  }
  // internal queue method
  _addToQueue({ opts, tests }) {
    // deal with events
    if (opts.type === 'event') {
      this.actionQueue.push({ tests, event: true, statement: opts.statement });
    } else {
      // replace last action if it is an event
      const previousAction = this.actionQueue[this.actionQueue.length - 1];
      const eventTests = previousAction && previousAction.event;
      if (eventTests) {
        // if the previous actionQueue item is an event, pass it this test instead.
        this.actionQueue[this.actionQueue.length - 1] = function () {
          global.it(`${opts.statement} & ${previousAction.statement}`, function () {
            return previousAction.tests(tests);
          });
        };
      } else {
        // no previous events, just pass the tests
        this.actionQueue.push(function () {
          global.it(opts.statement, function () { return tests(); });
        });
      }
    }
    return this;
  }
  _setContractInstance() {

  }
  _getContractInstance() {

  }
  _getContract() {
    // return instance of contract
  }
  _setContract() {

  }
  // TODO impelement these....
  // deploy deploys sets up a new contract instance
  deploy(newContract) {
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
  use(contract) {
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
