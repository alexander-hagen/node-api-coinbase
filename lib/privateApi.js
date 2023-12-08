const
  axios = require('axios'),
  crypto = require('crypto');

var CoinbasePrivate = function(api) {
  this.endPoint = "https://api.coinbase.com";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new CoinbasePrivate(api);
};

CoinbasePrivate.prototype.query = async function(options) {

  const stamp=Math.floor(Date.now() / 1000);

  var query=Object.assign({},options.data);
  var source=stamp+options.method.toUpperCase()+options.url.replace(this.endPoint,'').split("?")[0]+(Object.keys(query)==0?'':JSON.stringify(query));

  var signature = crypto.createHmac('sha256', this.secret).update(source).digest('hex');

  options["headers"]={
    "CB-ACCESS-KEY": this.apikey,
    "CB-ACCESS-TIMESTAMP": stamp,
    "CB-ACCESS-SIGN": signature
  };

  return async axios(options).then(function(res) {
    return res.data
  }).catch(function(err) {
    console.log("Error",err,options);
    throw new Error(err.statusCode);
  });
};

CoinbasePrivate.prototype.getQuery = async function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return await this.query(options);
};

CoinbasePrivate.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    data: query,
    json: true
  };
  return await this.query(options);
};

//
// Advance Trade Endpoints
//

// Accounts

CoinbasePrivate.prototype.listAccounts = function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccounts
  var path="/api/v3/brokerage/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getAccount = function(id) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccount
  const path="/api/v3/brokerage/accounts/:"+id;
  return this.getQuery(path,{});
};

// Products

CoinbasePrivate.prototype.getBest = function(symbols) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask
  const path="/api/v3/brokerage/best_bid_ask?"+symbols.join();
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getOrderBook = function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook
  var path="/api/v3/brokerage/product_book",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.listProducts = function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts
  var path="/api/v3/brokerage/products",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getProduct = function(symbol) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct
  var path="/api/v3/brokerage/products/"+symbol;
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getCandles = function(symbol,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getcandles
  var path="/api/v3/brokerage/products/"+symbol+"/candles",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getTrades = function(symbol,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades
  var path="/api/v3/brokerage/products/"+symbol+"/ticker",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

// Orders

CoinbasePrivate.prototype.createOrder = function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder
  const path="/api/v3/brokerage/orders";
  return this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.cancelOrders = function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders
  const path="/api/v3/brokerage/orders/batch_cancel";
  return this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.listOrders = function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders
  var path="/api/v3/brokerage/orders/historical/batch",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.listFills = function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getfills
  var path="/api/v3/brokerage/orders/historical/fills",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

CoinbasePrivate.prototype.getOrder = function(id) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder
  const path="/api/v3/brokerage/orders/historical/"+id;
  return this.getQuery(path,{});
};

// Fees

CoinbasePrivate.prototype.getTransactions = function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gettransactionsummary
  var path="/api/v3/brokerage/transaction_summary",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};
