const currency = require('currency.js');

const useMoney = ({ settings }) => {
  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settings;

  function currencyFormat(amount) {
    const value = currency(amount, {
      separator: thousand_sep,
      decimal: decimal_sep,
      symbol: ' ',
      precision: cent_precision,
    });

    return value.value === 0 && zero_format ? '0.00' : value.format();
  }

  // function currencyFormat(amount) {
  //   return currency(amount).dollar() > 0 || !zero_format
  //     ? currency(amount, {
  //         separator: thousand_sep,
  //         decimal: decimal_sep,
  //         symbol: '',
  //         precision: cent_precision,
  //       }).format()
  //     : 0 +
  //         currency(amount, {
  //           separator: thousand_sep,
  //           decimal: decimal_sep,
  //           symbol: '',
  //           precision: cent_precision,
  //         }).format();
  // }

  function moneyFormatter({ amount = 0, currencyCode = null }) {
    const symbols = { INR: '₹', USD: '$' };
    const symbol = currencyCode ? symbols[currencyCode] || currency_symbol : currency_symbol;

    return currency_position === 'before'
      ? symbol + ' ' + currencyFormat(amount)
      : currencyFormat(amount) + ' ' + symbol;
  }

  function amountFormatter({ amount = 0 }) {
    return currencyFormat(amount);
  }

  return {
    moneyFormatter,
    amountFormatter,
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  };
};

module.exports = useMoney;
