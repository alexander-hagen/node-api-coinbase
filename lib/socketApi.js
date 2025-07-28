const
  jwt = require('jsonwebtoken'),
  crypto = require('crypto'),
  WebSocket = require('ws');

const
  marketUrl = 'wss://advanced-trade-ws.coinbase.com',
  userUrl = 'wss://advanced-trade-ws-user.coinbase.com';

const auth=true, noauth=false;

var SocketNum=0;
class SocketClient {

  constructor(url, keys, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._promises = new Map();
    this._handles = new Map();
    this._num=(++SocketNum);

    if(keys!==undefined) {
      this.apikey=keys.apikey;
      this.secret=keys.secret;
    };

    this._createSocket(url);

    this.name=(keys==undefined?"generic":keys.name);
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);
    this._ws.onopen = async () => {
      console.log('ws connected', this.name);

      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
      console.log('ws closed', this.name);
      this._ws.emit('closed');
      this._ws=null;
    };

    this._ws.onerror = err => {
      console.log('ws error', this.name, err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onmessage = msg => {
      try {
        var message,parts,method,symbol,option;
        const parent=this;
        message=JSON.parse(msg.data);

        switch(message.channel) {

          case "subscriptions":
            method=message.channel;
            if (this._handles.has(message.channel)) {
              message.events.forEach(event => {
                this._handles.get(method).forEach((cb,i) => { cb(method,event.subscriptions,undefined,message.sequence_num); });
              });
//            } else {
//              console.log('ws no handler for', method, message);
            };
            break;

          case "heartbeats":
            method=message.channel;
            if (this._handles.has(method)) {
              message.events.forEach(event => {
                this._handles.get(method).forEach((cb,i) => { cb(method,event,undefined,message.sequence_num); });
              });
//            } else {
//              console.log('ws no handler for', method, message);
            };
            break;

          case "candles":
          case "status":
          case "ticker":
          case "ticker_batch":
          case "l2_data":
          case "user":
          case "market_trades":
          case "futures_balance_summary":
            message.events.forEach(event => {
              method=message.channel+"."+event.type;

              if (this._handles.has(method)) {
                this._handles.get(method).forEach((cb,i) => { cb(method,event,event.product_id,message.sequence_num); });
              } else {
                console.log('ws no handler for', method);
              };

            });
            break;

          default:
            console.log("ws unprocessed message",message);
            break;
        };

      } catch (e) {
        console.log('ws fail parse message', e);
      }

    };

  }

  async request(key, options, auth) {

    if (this._ws !== null && this._ws.readyState === WebSocket.OPEN) {

      const stamp=Math.floor(Date.now() / 1000);
      const algorithm="ES256";

      if(auth) {
        const token=jwt.sign({iss: "cdp", nbf: stamp, exp: stamp+120,sub: this.apikey},this.secret,{ algorithm, header: { kid: this.apikey, nonce: crypto.randomBytes(16).toString('hex') } });
        Object.assign(options, { jwt: token });
      };
      this._ws.send(JSON.stringify(options));
      return {success: true};

    } else {
      console.log("ws socket unavailable");
      return {success: false};
    };

  }

  setHandler(key, callback) {
    this._handles.set(key, []);
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

  clearHandlers() {
    this._handles.forEach((value,key,map) => { this.clearHandler(key); });
  }

}

var CoinbaseSocket = function(url, keys) {
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.socket = new SocketClient(url, keys, () => {
    this.initialized=true;
    if(keys!==undefined) { this.socket._ws.emit('authenticated'); } else { this.socket._ws.emit('initialized'); };
  });
};

module.exports = {
  marketApi: function() { return new CoinbaseSocket(marketUrl); },
  userApi: function(keys) { return new CoinbaseSocket(userUrl, keys); }
};


CoinbaseSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

CoinbaseSocket.prototype.clearHandler = function(method) {
  this.socket.clearHandler(method);
};

CoinbaseSocket.prototype.clearHandlers = function() {
  this.socket.clearHandlers();
};

//
// WEBSOCKET FEED
//

CoinbaseSocket.prototype.subscribeHeartbeats = async function() { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#heartbeats-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    channel: "heartbeats"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeHeartbeats = async function() { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#heartbeats-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    channel: "heartbeats"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeCandles = async function(symbols) { // hhttps://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#candles-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "candles"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeCandles = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#candles-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "candles"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeStatus = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#status-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "status"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeStatus = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#status-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "status"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeTicker = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "ticker"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeTicker = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "ticker"
  };
  const result = await this.socket.request(reqID,options);
  return result;
};

CoinbaseSocket.prototype.subscribeTickerBatch = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-batch-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "ticker_batch"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeTickerBatch = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#ticker-batch-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "ticker_batch"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeLevel2 = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#level2-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "level2"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeLevel2 = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#level2-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "level2"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeMarketTrades = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#market-trades-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "market_trades"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeMarketTrades = async function(symbols) { // https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/websocket/websocket-channels#market-trades-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "market_trades"
  };
  const result = await this.socket.request(reqID,options,noauth);
  return result;
};

CoinbaseSocket.prototype.subscribeUser = async function(symbols=[]) { // https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#user-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    product_ids: symbols,
    channel: "user"
  };
  const result = await this.socket.request(reqID,options,auth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeUser = async function(symbols=[]) { // https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#user-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    product_ids: symbols,
    channel: "user"
  };
  const result = await this.socket.request(reqID,options,auth);
  return result;
};


CoinbaseSocket.prototype.subscribeFutures = async function(symbols) { // https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#futures-balance-summary-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "subscribe",
    channel: "futures_balance_summary"
  };
  const result = await this.socket.request(reqID,options,auth);
  return result;
};

CoinbaseSocket.prototype.unsubscribeFutures = async function(symbols) { // https://docs.cdp.coinbase.com/advanced-trade/docs/ws-channels#futures-balance-summary-channel
  const reqID="id"+(++this.socket._id);
  const options={
    type: "unsubscribe",
    channel: "futures_balance_summary"
  };
  const result = await this.socket.request(reqID,options,auth);
  return result;
};
