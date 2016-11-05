import Contest from '../../../src';
const contest = new Contest({ debug: true });
//
// // woohoo!
contract('MetaCoin', function (accounts) {
  // if we want to redeploy the contract we can do so
  it('is ready', function () {
    const balance = 10000;
    const transfer = Math.ceil(Math.random() * balance / 2);

    contest
    .deploy(MetaCoin)
    .describe('Account Balances')
    .call('getBalance', 'initializes with correct balances', {
      [accounts[0]]: balance,
      [accounts[1]]: 0,
    })

    .describe('Library Import')
    .call('getBalanceInEth', 'returns correct value', {
      [accounts[0]]: balance * 2,
      [accounts[1]]: 0,
    })
    .use(MetaCoin.deployed())
    .describe('Transfer balances')
    .watch('Transfer', 'fires the events correctly', [
      { _from: accounts[0], _to: accounts[1], _value: transfer },
      { _from: accounts[1], _to: accounts[0], _value: transfer },
      { _from: accounts[0], _to: accounts[1], _value: transfer },
    ])
    .tx('sendCoin', 'transfer succeeds', [
      [accounts[1], transfer, { from: accounts[0] }],
      [accounts[0], transfer, { from: accounts[1] }],
      [accounts[1], transfer, { from: accounts[0] }],
    ])
    .call('getBalance', 'balances after transaction are correct', {
      [accounts[0]]: balance - transfer,
      [accounts[1]]: transfer,
    })

    .done();
  });
});
