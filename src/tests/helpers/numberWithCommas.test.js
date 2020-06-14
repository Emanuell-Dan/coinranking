const numberWithCommas = require('../../helpers/numberWithCommas').default;

describe('adds comma separators', () => {
  let largeNumber;

  test('error handling for invalid numbers', () => {
    largeNumber = numberWithCommas(null);
    expect(largeNumber).toEqual('');
  });

  test('to a large number', () => {
    largeNumber = numberWithCommas(285764);
    expect(largeNumber).toEqual('285,764');
  });

  test('to a large number coming as a string', () => {
    largeNumber = numberWithCommas('38369212');
    expect(largeNumber).toEqual('38,369,212');
  });

  test('to a dot separated number', () => {
    largeNumber = numberWithCommas('27901.902000000002');
    expect(largeNumber).toEqual('27,901.902,000,000,002');
  });
});
