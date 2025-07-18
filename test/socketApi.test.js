const
  dotenv = require("dotenv").config(),
  coinbase = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET;

const
  symbol="BTC-USD";

const
  timeout=6000,
  longwait=65000;

// Get sockets

//var accountAPI;
//var timers={};
 
var publicws,privatews;

describe('Websocket Market Data functions', () => {

  beforeAll(async () => { // initialize socket
    publicws=new coinbase.sockets.marketApi();
    await waitForConnection(publicws);
    await publicws.setHandler("heartbeats",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("subscriptions",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("candles.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("market_trades.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("market_trades.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("status.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker_batch.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("l2_data.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("l2_data.update",(method,data,period) => { eventHandler(method); });
    console.log("publicws connected");
  });

  test('Test subscribeHeartbeats() function', async () => {
    const result=await publicws.subscribeHeartbeats();
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test("Wait for 'heartbeats' event", async () => {
    const key="heartbeats";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  describe('Candles', () => {

    test('Test subscribeCandles() function', async () => {
      const result=await publicws.subscribeCandles([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'candles.*' event", async () => {
      const key="candles";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeCandles() function', async () => {
      const result=await publicws.unsubscribeCandles([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Market Trades', () => {

    test('Test subscribeMarketTrades() function', async () => {
      const result=await publicws.subscribeMarketTrades([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'market_trades.*' event", async () => {
      const key="market_trades";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeMarketTrades() function', async () => {
      const result=await publicws.unsubscribeMarketTrades([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Status', () => {

    test('Test subscribeStatus() function', async () => {
      const result=await publicws.subscribeStatus([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'status.*' event", async () => {
      const key="status";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeStatus() function', async () => {
      const result=await publicws.unsubscribeStatus([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Ticker', () => {

    test('Test subscribeTicker() function', async () => {
      const result=await publicws.subscribeTicker([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'ticker.*' event", async () => {
      const key="ticker";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeTicker() function', async () => {
      const result=await publicws.unsubscribeTicker([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Ticker Batch', () => {

    test('Test subscribeTickerBatch() function', async () => {
      const result=await publicws.subscribeTickerBatch([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'ticker_batch.*' event", async () => {
      const key="ticker_batch";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeTickerBatch() function', async () => {
      const result=await publicws.unsubscribeTickerBatch([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Level 2', () => {

    test('Test subscribeLevel2() function', async () => {
      const result=await publicws.subscribeLevel2([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'l2_data.*' event", async () => {
      const key="l2_data";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeLevel2() function', async () => {
      const result=await publicws.unsubscribeLevel2([ symbol ]);
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  test('Test unsubscribeHeartbeats() function', async () => {
    const result=await publicws.unsubscribeHeartbeats();
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test("Wait for 'subscriptions' event", async () => {
    const key="subscriptions";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  afterAll(async () => { // clean-up socket
//    await publicws.clearHandlers();
//    publicws.socket.terminate();
  });

});

describe('Websocket User Data functions', () => {

  beforeAll(async () => { // initialize socket
    privatews=new coinbase.sockets.userApi({"apikey": apikey, "secret": secret });
    await waitForConnection(privatews);
    await privatews.setHandler("heartbeats",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("subscriptions",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("user.snapshot",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("futures_balance_summary.snapshot",(method,data,period) => { eventHandler(method); });
    console.log("privatews connected");
  });

  test('Test subscribeHeartbeats() function', async () => {
    const result=await privatews.subscribeHeartbeats();
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test("Wait for 'heartbeats' event", async () => {
    const key="heartbeats";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  describe('User', () => {

    test('Test subscribeUser() function', async () => {
      const result=await privatews.subscribeUser();
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'user.*' event", async () => {
      const key="user";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeUser() function', async () => {
      const result=await privatews.unsubscribeUser();
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  describe('Futures', () => {

    test('Test subscribeFutures() function', async () => {
      const result=await privatews.subscribeFutures();
      expect(result).toHaveProperty("success",true);
    }, timeout);

    test("Wait for 'futures_balance_summary.*' event", async () => {
      const key="futures_balance_summary";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

    test('Test unsubscribeFutures() function', async () => {
      const result=await privatews.unsubscribeFutures();
      expect(result).toHaveProperty("success",true);
    }, timeout);

  });

  test('Test unsubscribeHeartbeats() function', async () => {
    const result=await publicws.unsubscribeHeartbeats();
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test("Wait for 'subscriptions' event", async () => {
    const key="subscriptions";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

  afterAll(async () => { // clean-up socket
//    await publicws.clearHandlers();
//    publicws.socket.terminate();
  });

});


// Error testing

// Helper functions

function stringIsJSON(str) {
  try { 
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function stringIsArray(str) {
  try { 
    return Array.isArray(str);
  } catch {
    return false;
  }
};

function objectIsJSON(obj) {
  try { 
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

function waitForConnection(websocket) {
  var socketResolve,socketReject;
  var done=false;
  var timer=setTimeout( () => { if(!done) { socketReject(done); }; }, timeout);

  websocket.socket._ws.on('authenticated', async () => { // Wait for websocket to authenticate.
    console.log('authenticated');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('initialized', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  var promise=new Promise(function(resolve, reject) { socketResolve=resolve; socketReject=reject; });

  return promise;
};

var _promises = new Map();
var timers={};
var events={};

function eventHandler(fullkey) {
  const key=fullkey.split(".")[0];
  events[key]=true;
  if (_promises.has(key)) {
    clearTimeout(timers[key]);
    const cb = _promises.get(key);
    _promises.delete(key);
    cb.resolve(key);
  };
};

function waitForPromise(key) {
  return new Promise((resolve, reject) => {
    if(events[key]) { resolve(key); }
    else {
      _promises.set(key, {resolve, reject});
      timers[key]=setTimeout(() => {
        if(_promises.has(key)) {
          _promises.delete(key);
          reject(key);
        } else { resolve(key); }
      }, timeout-1000);
    }
  });
};
