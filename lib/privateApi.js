const
  axios = require('axios'),
  crypto = require('crypto');

var RevolutPrivate = function(api) {
  this.endPoint = "https://revx.revolut.com";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new RevolutPrivate(api);
};

RevolutPrivate.prototype.query = async function(options) {

  const stamp=Date.now().toString();
  const parts=options.url.replace(this.endPoint,'').split("?");
  const uri=parts[0];
  const query=parts[1];
  const payload=stamp+options.method.toUpperCase()+uri+(query!==undefined?query:"");

  const buffer=crypto.sign(null, Buffer.from(payload), this.secret);
  const sign=buffer.toString('base64');

  options["headers"]={
    "X-Revx-API-Key": this.apikey,
    "X-Revx-Timestamp": stamp,
    "X-Revx-Signature": sign
  };

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response={ data: options };
    if(!err.hasOwnProperty("response")) { Object.assign(response,{ status: "503", error: err.code }); }
    else {
      Object.assign(response,{ status: err.response.status, error: err.response.statusText });
      if(!!err.response.data && (err.response.data===Object)) { Object.assign(response,{ error: err.response.data.code, reason: err.response.data.message }); };
    };
    return response;
  };

};

RevolutPrivate.prototype.getQuery = async function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return await this.query(options);
};

RevolutPrivate.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    data: query,
    json: true
  };
  return await this.query(options);
};

// Accounts

RevolutPrivate.prototype.getAllBalances = async function() { // https://developer.revolut.com/docs/x-api/get-all-currencies
  var path="/api/1.0/balances";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

// Configuration

RevolutPrivate.prototype.getAllCurrencies = async function() { // https://developer.revolut.com/docs/x-api/get-all-currencies
  const path="/api/1.0/configuration/currencies";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result.trades); };
  });
};

RevolutPrivate.prototype.getAllCurrencyPairs = async function() { // https://developer.revolut.com/docs/x-api/get-all-currency-pairs
  const path="/api/1.0/configuration/pairs";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

// Orders

RevolutPrivate.prototype.placeOrder = async function(options) { // https://developer.revolut.com/docs/x-api/place-order
  const path="/api/1.0/orders";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result.trade); };
  });
};

RevolutPrivate.prototype.getActiveOrders = async function(options) { // https://developer.revolut.com/docs/x-api/get-active-orders
  var path="/api/1.0/orders/active",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getHistoricalOrders = async function(options) { // https://developer.revolut.com/docs/x-api/get-historical-orders
  var path="/api/1.0/orders/historical",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getOrderByID = async function(id) { // https://developer.revolut.com/docs/x-api/get-order
  const path="/api/1.0/orders/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.cancelOrderByID = async function(id) { // https://developer.revolut.com/docs/x-api/cancel-order
  const path="/api/1.0/orders/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("DELETE",path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getFillsByID = async function(id) { // https://developer.revolut.com/docs/x-api/get-order-fills
  const path="/api/1.0/orders/fills/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

// Trades

RevolutPrivate.prototype.getPublicTrades = async function(symbol,options) { // https://developer.revolut.com/docs/x-api/get-all-trades
  var path="/api/1.0/trades/all/"+symbol,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getClientTrades = async function(symbol,options) { // https://developer.revolut.com/docs/x-api/get-all-trades
  var path="/api/1.0/trades/private/"+symbol,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

// Market Data

RevolutPublic.prototype.getOrderbook = async function(symbol,limit=20) { // https://developer.revolut.com/docs/x-api/get-order-book
  const path="/api/1.0/order-book/"+symbol+"?limit="+limit;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getCandles = async function(symbol,options) { // https://developer.revolut.com/docs/x-api/get-candles
  var path="/api/1.0/candles/"+symbol,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};

RevolutPrivate.prototype.getTickers = async function(symbols) { // https://developer.revolut.com/docs/x-api/get-ticker
  const path="/api/1.0/tickers?symbols="+symbols;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};
