const convertToDateString = require('../../helpers/convertToDateString').default;

describe('converts string to the date portion of a Date', () => {
  let date;

  test('error handling for invalid dates', () => {
    date = convertToDateString(null);
    expect(date).toEqual('');
  });

  test('valid date coming as a number', () => {
    date = convertToDateString(1570197780000);
    expect(date).toEqual('Fri Oct 04 2019');
  });

  test('valid date coming as a string', () => {
    date = convertToDateString('1541808000000');
    expect(date).toEqual('Sat Nov 10 2018');
  });
});
