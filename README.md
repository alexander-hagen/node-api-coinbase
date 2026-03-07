# node-api-revolut

![Statements](https://img.shields.io/badge/statements-71.98%25-yellow.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-43.22%25-red.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-70%25-yellow.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-79.81%25-yellow.svg?style=flat)

Non-official implementation of Revolut's Crypto API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

| API           | DESCRIPTION |
| :----         | :---- |
| getLastTrades | https://developer.revolut.com/docs/x-api/get-last-trades       |
| getOrderbook  | https://developer.revolut.com/docs/x-api/get-public-order-book |

## __PRIVATE API__

** Supports ECDSA Signature Algorithm only **

```javascript
  const revolut=require('node-api-revolut');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new revolut.privateApi(auth);

```

| API                 | DESCRIPTION |
| :----               | :---- |
| getAllBalances      | https://developer.revolut.com/docs/x-api/get-all-balances       |
| getAllCurrencies    | https://developer.revolut.com/docs/x-api/get-all-currencies     |
| getAllCurrencyPairs | https://developer.revolut.com/docs/x-api/get-all-currency-pairs |
| placeOrder          | https://developer.revolut.com/docs/x-api/place-order            |
| getActiveOrders     | https://developer.revolut.com/docs/x-api/get-active-orders      |
| getHistoricalOrders | https://developer.revolut.com/docs/x-api/get-historical-orders  |
| getOrderByID        | https://developer.revolut.com/docs/x-api/get-order              |
| cancelOrderByID     | https://developer.revolut.com/docs/x-api/cancel-order           |
| getFillsByID        | https://developer.revolut.com/docs/x-api/get-order-fills        |
| getPublicTrades     | https://developer.revolut.com/docs/x-api/get-all-trades         |
| getClientTrades     | https://developer.revolut.com/docs/x-api/get-private-trades     |
| getOrderbook        | https://developer.revolut.com/docs/x-api/get-order-book         |
| getCandles          | https://developer.revolut.com/docs/x-api/get-candles            |
| getTickers          | https://developer.revolut.com/docs/x-api/get-ticker             |
