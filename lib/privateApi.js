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

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response={ data: options };
    if(!err.hasOwnProperty("response")) { Object.assign(response,{ status: "503", error: err.code }); }
    else {
      Object.assign(response,{ status: err.response.status});
      if(err.response.hasOwnProperty("data")) { Object.assign(response,{ error: err.response.data.code, reason: err.response.data.message }); };
    };
    return response;
  };

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

CoinbasePrivate.prototype.listAccounts = async function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccounts
  var path="/api/v3/brokerage/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getAccount = async function(id) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccount
  const path="/api/v3/brokerage/accounts/:"+id;
  return await this.getQuery(path,{});
};

// Orders

CoinbasePrivate.prototype.createOrder = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder
  const path="/api/v3/brokerage/orders";
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.cancelOrders = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders
  const path="/api/v3/brokerage/orders/batch_cancel";
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.editOrder = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_editorder
  const path="/api/v3/brokerage/orders/edit";
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.editOrderPreview = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_previeweditorder
  const path="/api/v3/brokerage/orders/edit_preview";
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.listOrders = async function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders
  var path="/api/v3/brokerage/orders/historical/batch",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.listFills = async function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getfills
  var path="/api/v3/brokerage/orders/historical/fills",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getOrder = async function(id) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder
  const path="/api/v3/brokerage/orders/historical/"+id;
  return await this.getQuery(path,{});
};

// Products

CoinbasePrivate.prototype.getBest = async function(symbols) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask
  const path="/api/v3/brokerage/best_bid_ask?"+symbols.join();
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getOrderBook = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook
  var path="/api/v3/brokerage/product_book",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.listProducts = async function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts
  var path="/api/v3/brokerage/products",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getProduct = async function(symbol) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct
  const path="/api/v3/brokerage/products/"+symbol;
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getCandles = async function(symbol,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getcandles
  var path="/api/v3/brokerage/products/"+symbol+"/candles",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

CoinbasePrivate.prototype.getTrades = async function(symbol,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades
  var path="/api/v3/brokerage/products/"+symbol+"/ticker",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

// Fees

CoinbasePrivate.prototype.getTransactions = async function(options={}) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gettransactionsummary
  var path="/api/v3/brokerage/transaction_summary",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};

// Convert

CoinbasePrivate.prototype.createQuote = async function(options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_createconvertquote
  const path="/api/v3/brokerage/convert/quote";
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.commitConvert = async function(id,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_commitconverttrade
  const path="/api/v3/brokerage/convert/trade/"+id;
  return await this.otherQuery("POST",path,options);
};

CoinbasePrivate.prototype.getConvert = async function(id,options) { // https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_commitconverttrade
  const path="/api/v3/brokerage/convert/trade/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await this.getQuery(path,{});
};
