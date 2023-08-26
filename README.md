# node-api-coinbase

**WARNING: This package is still early beta! Expect breaking changes until this sees a major release.**

Non-official implementation of Coinbase's Advanced Trade API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

Nothing here

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
| listAccounts            | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccounts |
| getAccount              | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccount  |

### Products

| API                     | DESCRIPTION |
| :----                   | :---- |
| getBest                 | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask   |
| getOrderBook            | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook  |
| listProducts            | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts     |
| getProduct              | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct      |
| getCandles              | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getcandles      |
| getTrades               | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades |

### Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| createOrder             | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder           |
| cancelOrders            | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders        |
| listOrders              | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders |
| listFills               | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getfills            |
| getOrder                | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder  |

### Fees

| API                     | DESCRIPTION |
| :----                   | :---- |
| getTransactions         | https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gettransactionsummary |

## __WEBSOCKET API__

```javascript
  const coinbase=require('node-api-coinbase');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const tradingAPI=new coinbase.sockets.tradingApi(auth);
  tradingAPI.setHandler('user.snapshot', (method,data,symbol,option) => { updateOrder(method,data.orders,user,api,handler); });
  tradingAPI.setHandler('user.update', (method,data,symbol,option) => { updateOrder(method,data.orders,user,api,handler); });

  tradingAPI.socket._ws.on('authenticated', async () => {
    await tradingAPI.subscribeUser(['ETH-BTC','BTC-USDT']);

  });

  tradingAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };

```

| API                                         | HANDLER                                     | DESCRIPTION |
| :----                                       | :----                                       | :---- |
| subscribe* unsubscribe*                     | subscriptions                               |                                                                                           |
| subscribeHeartbeats unsubscribeHeartbeats   | heartbeats                                  | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#heartbeats-channel    |
| subscribeCandles unsubscribeCandles         | candles.snapshot candles.update             | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#candles-channel       |
| subscribeStatus unsubscribeStatus           | status.snapshot status.update(?)            | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#status-channel        |
| subscribeTicker unsubscribeTicker           | ticker.snapshot ticker.update               | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#ticker-channel        |
| subscribeTickerBatch unsubscribeTickerBatch | ticker_batch.snapshot ticker_batch.update   | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#ticker-batch-channel  |
| subscribeOrderbook unsubscribeOrderbook     | l2_data.snapshot l2_data.update             | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#level2-channel        |
| subscribeUser unsubscribeUser               | user.snapshot user.update(?)                | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#user-channel          |
| subscribeTrades unsubscribeTrades           | market_trades.snapshot market_trades.update | https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#market-trades-channel |
