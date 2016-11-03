import assert from 'assert';

import parser from './parse_inputs';
import tester from './test_factory';
// import deploy from './deploy';

export default class Contest {
  constructor({ debug = false } = {}) {
    this.config = { debug };
    this._contract = null;
    this._actionQueue = [];
    return this;
  }
  // uses already-deployed contract
  use(contract) {
    // if we pass the text we create an upper level describe block
    if (!contract) { throw new Error('Contract not defined!'); }
    const setContract = this._setContract.bind(this);
    this.describe(contract.contract_name);
    this.it('', function () {
      assert.ok(contract.address);
      setContract(contract);
    });
    return this;
  }
  // or deploy a new one
  deploy(newContract, args = []) {
    // let's deploy this bizatch
    const setContract = this._setContract.bind(this);
    this.describe(newContract.contract_name);
    this.it('deploys', function () {
      return newContract.new.apply(newContract, args)
      .then((contract) => {
        assert.ok(contract.address);
        setContract(contract);
      })
      .catch(err => assert.ifError(err));
    });
    return this;
  }
  // pass statment and method to parser
  _(...args) {
    const { config } = this;
    const opts = parser(args);
    const promise = tester({ ...opts, config, contract: this._getContract.bind(this) });
    this._addToQueue({ opts, promise });
    return this;
  }
  // execute the current queue
  done() {
    const actions = this._actionQueue;
    if (!actions.length) { return this; }
    global.describe(this.describeBlock, function () {
      actions.forEach(fn => fn.promise ? fn.promise() : fn());
    });
    return this;
  }
  it(statement, promise) {
    this._addCustomAction(statement, promise);
    return this;
  }
  before(promise) {
    this._addCustomAction(null, promise, 'before');
    return this;
  }
  // describe blocks set up a new `it` queue
  describe(statement) {
    console.log('descriving')
    this.done();
    this.describeBlock = statement;
    this._actionQueue = [];
    return this;
  }
  _addCustomAction(statement, promise, type) {
    this._addToQueue({
      promise: () => promise(this._getContract()),
      opts: {
        statement,
        type,
      },
    });
  }
  // internal queue method
  _addToQueue({ opts, promise }) {
    // deal with things that should be merged into preceeding test
    console.log('adding to que', opts)
    if (opts.type === 'event' || opts.type === 'before') {
      this._actionQueue.push({ promise, before: true, statement: opts.statement });
    } else {
      // replace last action if it is an event
      const previousAction = this._actionQueue[this._actionQueue.length - 1] || {};
      if (previousAction.before) {
        // if the previous _actionQueue item is an event, pass it this test instead.
        this._actionQueue[this._actionQueue.length - 1] = function () {
          const previousStatement = previousAction.statement ? `${previousAction.statement} & ` : '';
          global.it(`${previousStatement}${opts.statement}`, function () {
            return previousAction.promise(promise);
          });
        };
      } else {
        // no previous events, just pass the promise
        this._actionQueue.push(function () {
          global.it(opts.statement, function () { return promise(); });
        });
      }
    }
    console.log('added');
    return this;
  }
  // return current instance of contract
  _getContract() {
    return this._contract;
  }
  // set contract instance
  _setContract(contract) {
    this._contract = contract;
  }
}
