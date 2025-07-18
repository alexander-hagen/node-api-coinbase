# node-api-coinbase

![Statements](https://img.shields.io/badge/statements-64.8%25-red.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-35.25%25-red.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-61.29%25-red.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-72.95%25-red.svg?style=flat)

Non-official implementation of Coinbase's Advanced Trade API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

| API               | DESCRIPTION |
| :----             | :---- |
| getMarketTrades   | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-market-trades   |
| getProduct        | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product         |
| getProductBook    | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product-book    |
| getProductCandles | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product-candles |
| getServerTime     | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-server-time            |
| listProducts      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/list-public-products       |

## __PRIVATE API__

** Supports ECDSA Signature Algorithm only **

```javascript
  const coinbase=require('node-api-coinbase');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new coinbase.privateApi(auth);

```

### Accounts

| API                     | DESCRIPTION |
| :----                   | :---- |
| getAccount              | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/accounts/get-account             |
| listAccounts            | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/accounts/list-accounts           |

### Convert

| API                     | DESCRIPTION |
| :----                   | :---- |
| commitConvertTrade      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/commit-convert-trade     |
| createConvertTrade      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/create-convert-quote     |
| getConvertTrade         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/get-convert-trade        |

### Data API

| API                     | DESCRIPTION |
| :----                   | :---- |
| getAPIKeyPermissions    | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/data-api/get-api-key-permissions |

### Fees

| API                     | DESCRIPTION |
| :----                   | :---- |
| getTransactionSummary   | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gettransactionsummary          |

### Futures

| API                       | DESCRIPTION |
| :----                     | :---- |
| cancelPendingFuturesSweep | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/cancel-pending-futures-sweep |
| getCurrentMarginWindow    | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-current-margin-window    |
| getFururesBalanceSummary  | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-futures-balance-summary  |
| getFuturesPosition        | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-futures-position         |
| getIntradayMarginSettings | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-intraday-margin-setting  |
| listFuturesPositions      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/list-futures-positions       |
| listFuturesSweeps         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/list-futures-sweeps          |
| scheduleFuturesSweep      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/schedule-futures-sweep       |
| setIntradayMarginSettings | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/set-intraday-margin-settings |

### Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| cancelOrders            | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/cancel-order         |
| closePosition           | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/close-position       |
| createOrder             | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/create-order         |
| editOrder               | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/edit-order           |
| editOrderPreview        | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/edit-order-preview   |
| getOrder                | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/get-order            |
| listFills               | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/list-fills           |
| listOrders              | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/list-orders          |
| previewOrder            | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/preview-orders       |

### Payment Methods

| API                     | DESCRIPTION |
| :----                   | :---- |
| listPaymentMethods      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/payment-methods/get-payment-method   |
| getPaymentMethod        | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/payment-methods/list-payment-methods |

### Perpetuals

| API                           | DESCRIPTION |
| :----                         | :---- |
| allocatePortfolio             | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/allocate-portfolio               |
| getPerpetualsPortfolioSummary | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-perpetuals-portfolio-summary |
| getPerpetualsPosition         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-perpetuals-position          |
| getPortfoliosBalances         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-portfolio-balances           |
| listPerpetualsPositions       | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/list-perpetuals-positions        |
| optMultiAssetCollateral       | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/opt-in-or-out                    |

### Portfolios

| API                     | DESCRIPTION |
| :----                   | :---- |
| createPortfolio         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/create-portfolio        |
| deletePortfolio         | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/delete-portfolio        |
| editPortfolio           | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/edit-portfolio          |
| getPortfolioBreakdown   | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/get-portfolio-breakdown |
| listPortfolios          | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/list-portfolios         |
| movePortfolioFunds      | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/move-portfolios-funds   |

### Products

| API                     | DESCRIPTION |
| :----                   | :---- |
| getBest                 | https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/products/get-best-bid-ask |
| getMarketTrades         | Not implemented. Use public API instead                                                           |
| getProduct              | Not implemented. Use public API instead                                                           |
| getProductBook          | Not implemented. Use public API instead                                                           |
| getProductCandles       | Not implemented. Use public API instead                                                           |
| getServerTime           | Not implemented. Use public API instead                                                           |
| listProducts            | Not implemented. Use public API instead                                                           |

### API

| API               | DESCRIPTION |
| :----             | :---- |
| getAPIPermissions | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getapikeypermissions |

## __WEBSOCKET API__

```javascript
  const coinbase=require('node-api-coinbase');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const
    userAPI=new coinbase.sockets.userApi(auth),
    marketAPI=new coinbase.sockets.marketApi();

  userAPI.setHandler('user.snapshot', (method,data,symbol,option) => { updateOrder(method,data.orders,user,api,handler); });
  userAPI.setHandler('user.update', (method,data,symbol,option) => { updateOrder(method,data.orders,user,api,handler); });

  userAPI.socket._ws.on('authenticated', async () => {
    await tradingAPI.subscribeUser(['ETH-BTC','BTC-USDT']);

  });

  userAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };

```

| API                                           | HANDLER                                   | DESCRIPTION |
| :----                                         | :----                                     | :---- |
| subscribeHeartbeats unsubscribeHeartbeats     | heartbeats                                | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#heartbeats-channel    |
| subscribeCandles unsubscribeCandles           | candles.snapshot *.update                 | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#candles-channel       |
| subscribeStatus unsubscribeStatus             | status.snapshot *.update                  | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-channel        |
| subscribeTickerBatch unsubscribeTickerBatch   | ticker_batch.snapshot *.update            | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-batch-channel  |
| subscribeLevel2 unsubscribeLevel2             | l2_data.snapshot *.update                 | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#level2-channel        |
| subscribeMarketTrades unsubscribeMarketTrades | market_trades.snapshot *.update           | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#market-trades-channel |
| subscribeUser unsubscribeUser                 | user.snapshot *.update                    | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#user-channel                    |
| subscribeFutures unsubscribeFutures           | futures_balance_summary.snapshot *.update | https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#futures-balance-summary-channel |
