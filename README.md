# node-api-coinbase

**WARNING: This package is still early beta! Expect breaking changes until this sees a major release.**

Non-official implementation of Coinbase's Advanced Trade API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

| API               | DESCRIPTION |
| :----             | :---- |
| getServerTime     | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getservertime         |
| getProductBook    | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproductbook  |
| listProducts      | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproducts     |
| getProduct        | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproduct      |
| getProductCandles | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpubliccandles      |
| getMarketTrades   | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicmarkettrades |

## __PRIVATE API__

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
| listAccounts            | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts |
| getAccount              | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount  |

### Products

| API                     | DESCRIPTION |
| :----                   | :---- |
| getBest                 | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getbestbidask   |
| getOrderBook            | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproductbook  |
| listProducts            | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproducts     |
| getProduct              | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproduct      |
| getCandles              | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcandles      |
| getTrades               | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getmarkettrades |

### Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| createOrder             | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_postorder                 |
| cancelOrders            | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelorders              |
| editOrder               | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editorder                 |
| editOrderPreview        | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeweditorder          |
| listOrders              | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorders       |
| listFills               | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfills                  |
| getOrder                | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorder        |
| previewOrder            | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeworder              |
| closePosition           | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_closeposition             |

### Portfolios

| API                     | DESCRIPTION |
| :----                   | :---- |
| listPortfolios          | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfolios         |
| createPortfolio         | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createportfolio       |
| movePortfolioFunds      | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds    |
| getPortfolioBreakdown   | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfoliobreakdown |
| deletePortfolio         | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_deleteportfolio       |
| editPortfolio           | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editportfolio         |

### Futures

| API                       | DESCRIPTION |
| :----                     | :---- |
| getFururesBalanceSummary  | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmbalancesummary     |
| getIntradayMarginSettings | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintradaymarginsetting |
| setIntradayMarginSettings | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_setintradaymarginsetting |
| getCurrentMarginWindow    | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcurrentmarginwindow   |
| listFuturesPositions      | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmpositions          |
| getFuturesPositions       | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition           |
| scheduleFuturesSweep      | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_schedulefcmsweep         |
| listFuturesSweeps         | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmsweeps             |
| cancelPendingFuturesSweep | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelfcmsweep           |

### Perpetuals

| API                           | DESCRIPTION |
| :----                         | :---- |
| allocatePortfolio             | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_allocateportfolio        |
| getPerpetualsPortfolioSummary | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxportfoliosummary  |
| listPerpetualsPositions       | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxpositions         |
| getPerpetualsPosition         | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxposition          |
| getPortfoliosBalances         | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxbalances          |
| optMultiAssetCollateral       | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_intxmultiassetcollateral |

### Fees

| API                   | DESCRIPTION |
| :----                 | :---- |
| getTransactionSummary | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gettransactionsummary |

### Convert

| API                | DESCRIPTION |
| :----              | :---- |
| createConvertQuote | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createconvertquote       |
| getConvertTrade    | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getconverttrade          |
| commitConvertTrade | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade       |

### Payment Methods

| API                | DESCRIPTION |
| :----              | :---- |
| listPaymentMethods | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethods |
| getPaymentMethod   | https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethod  |

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
    userAPI=new coinbase.sockets.userApi(auth);
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

| API                                         | HANDLER                                     | DESCRIPTION |
| :----                                       | :----                                       | :---- |
| subscribe* unsubscribe*                     | subscriptions                               |                                                                                               |
| subscribeHeartbeats unsubscribeHeartbeats   | heartbeats                                  | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#heartbeats-channel              |
| subscribeCandles unsubscribeCandles         | candles.snapshot candles.update             | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#candles-channel                 |
| subscribeStatus unsubscribeStatus           | status.snapshot status.update(?)            | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#status-channel                  |
| subscribeTicker unsubscribeTicker           | ticker.snapshot ticker.update               | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#ticker-channel                  |
| subscribeTickerBatch unsubscribeTickerBatch | ticker_batch.snapshot ticker_batch.update   | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#ticker-batch-channel            |
| subscribeOrderbook unsubscribeOrderbook     | l2_data.snapshot l2_data.update             | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#level2-channel                  |
| subscribeUser unsubscribeUser               | user.snapshot user.update(?)                | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#user-channel                    |
| subscribeTrades unsubscribeTrades           | market_trades.snapshot market_trades.update | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#market-trades-channel           |
| subscribeFutures unsubscribeFutures         | market_trades.snapshot market_trades.update | https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#futures-balance-summary-channel |
