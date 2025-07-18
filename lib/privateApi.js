const
  axios = require('axios'),
  jwt = require('jsonwebtoken'),
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
  const algorithm="ES256";
  const uri=options.method+' '+this.endPoint.replace("https://",'')+options.url.replace(this.endPoint,'').split("?")[0];

  const token=jwt.sign({ iss: "cdp", nbf: stamp, exp: stamp+120, sub: this.apikey, uri },this.secret,{ algorithm, header: { kid: this.apikey, nonce: crypto.randomBytes(16).toString("hex") } });

  options["headers"]={
    "Authorization": "Bearer "+token
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

CoinbasePrivate.prototype.ounts = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/accounts/list-accounts
  var path="/api/v3/brokerage/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getAccount = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/accounts/get-account
  const path="/api/v3/brokerage/accounts/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.account); };
  });
};

// Convert

CoinbasePrivate.prototype.commitConvertTrade = async function(id,options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/commit-convert-trade
  const path="/api/v3/brokerage/convert/trade/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.trade); };
  });
};

CoinbasePrivate.prototype.createConvertTrade = async function(options) { //  https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/create-convert-quote
  const path="/api/v3/brokerage/convert/quote";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.trade); };
  });
};

CoinbasePrivate.prototype.getConvertTrade = async function(id,options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/convert/get-convert-trade
  var path="/api/v3/brokerage/convert/trade/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.trade); };
  });
};

// Data API

CoinbasePrivate.prototype.getAPIKeyPermissions = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/data-api/get-api-key-permissions
  const path="/api/v3/brokerage/key_permissions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Fees

CoinbasePrivate.prototype.getTransactionSummary = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/fees/get-transaction-summary
  var path="/api/v3/brokerage/transaction_summary",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Futures

CoinbasePrivate.prototype.cancelPendingFuturesSweep = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/cancel-pending-futures-sweep
  const path="/api/v3/brokerage/cfm/sweeps";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("DELETE",path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getCurrentMarginWindow = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-current-margin-window
  var path="/api/v3/brokerage/cfm/intraday/current_margin_window",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getFuturesBalanceSummary = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-futures-balance-summary
  const path="/api/v3/brokerage/cfm/balance_summary";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else {
      const value=(result.balance_summary==null?{}:result.balance_summary);
      resolve(value);
    };
  });
};

CoinbasePrivate.prototype.getFuturesPosition = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-futures-position
  const path="/api/v3/brokerage/cfm/positions/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.position); };
  });
};

CoinbasePrivate.prototype.getIntradayMarginSetting = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/get-intraday-margin-setting
  const path="/api/v3/brokerage/cfm/intraday/margin_setting";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listFuturesPositions = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/list-futures-positions
  const path="/api/v3/brokerage/cfm/positions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.positions); };
  });
};

CoinbasePrivate.prototype.listFuturesSweeps = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/list-futures-sweeps
  const path="/api/v3/brokerage/cfm/sweeps";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.sweeps); };
  });
};

CoinbasePrivate.prototype.scheduleFuturesSweep = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/schedule-futures-sweep
  const path="/api/v3/brokerage/cfm/sweeps/schedule";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.setIntradayMarginSettings = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/futures/set-intraday-margin-settings
  const path="/api/v3/brokerage/cfm/intraday/margin_setting";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Orders

CoinbasePrivate.prototype.cancelOrders = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/cancel-order
  const path="/api/v3/brokerage/orders/batch_cancel";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.results); };
  });
};

CoinbasePrivate.prototype.closePosition = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/close-position
  const path="/api/v3/brokerage/orders/close_position";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else {
      if(result.success) { resolve(result); } else { reject(result); };
    };
  });
};

CoinbasePrivate.prototype.createOrder = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/create-order
  const path="/api/v3/brokerage/orders";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else {
      if(result.success) { resolve(result); } else { reject(result); };
    };
  });
};

CoinbasePrivate.prototype.editOrder = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/edit-order
  const path="/api/v3/brokerage/orders/edit";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else {
      if(result.success) { resolve(result); } else { reject(result); };
    };
  });
};

CoinbasePrivate.prototype.editOrderPreview = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/edit-order-preview
  const path="/api/v3/brokerage/orders/edit_preview";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else {
      if(!result.hasOwnProperty("errors")) { resolve(result); } else { reject(result); };
    };
  });
};

CoinbasePrivate.prototype.getOrder = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/get-order
  const path="/api/v3/brokerage/orders/historical/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.order); };
  });
};

CoinbasePrivate.prototype.listFills = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/list-fills
  var path="/api/v3/brokerage/orders/historical/fills",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listOrders = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/list-orders
  var path="/api/v3/brokerage/orders/historical/batch",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.previewOrder = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/orders/preview-orders
  const path="/api/v3/brokerage/orders/preview";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Payment Methods

CoinbasePrivate.prototype.getPaymentMethod = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/payment-methods/get-payment-method
  const path="/api/v3/brokerage/payment_methods/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.payment_method); };
  });
};

CoinbasePrivate.prototype.listPaymentMethods = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/payment-methods/list-payment-methods
  const path="/api/v3/brokerage/payment_methods";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.payment_methods); };
  });
};

// Perpetuals

CoinbasePrivate.prototype.allocatePortfolio = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/allocate-portfolio
  const path="/api/v3/brokerage/intx/allocate";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPerpetualsPortfolioSummary = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-perpetuals-portfolio-summary
  const path="/api/v3/brokerage/intx/portfolio/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.portfolios); };
  });
};

CoinbasePrivate.prototype.getPerpetualsPosition = async function(id,symbol) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-perpetuals-position
  const path="/api/v3/brokerage/intx/positions/"+id+"/"+symbol;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.position); };
  });
};

CoinbasePrivate.prototype.getPortfoliosBalances = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/get-portfolio-balances
  const path="/api/v3/brokerage/intx/balances/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.portfolio_balances); };
  });
};

CoinbasePrivate.prototype.listPerpetualsPositions = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/list-perpetuals-positions
  const path="/api/v3/brokerage/intx/positions/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.positions); };
  });
};

CoinbasePrivate.prototype.optMultiAssetCollateral = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/perpetuals/opt-in-or-out
  const path="/api/v3/brokerage/intx/multi_asset_collateral";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Portfolios

CoinbasePrivate.prototype.createPortfolio = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/create-portfolio
  var path="/api/v3/brokerage/portfolios",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.portfolio); };
  });
};

CoinbasePrivate.prototype.deletePortfolio = async function(id) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/delete-portfolio
  const path="/api/v3/brokerage/portfolios/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("DELETE",path,{}); // Needs API key for that portfolio
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.editPortfolio = async function(id,options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/edit-portfolio
  const path="/api/v3/brokerage/portfolios/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("PUT",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.portfolio); };
  });
};

CoinbasePrivate.prototype.getPortfolioBreakdown = async function(id,options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/get-portfolio-breakdown
  var path="/api/v3/brokerage/portfolios/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.breakdown); };
  });
};

CoinbasePrivate.prototype.listPortfolios = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/list-portfolios
  var path="/api/v3/brokerage/portfolios",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.portfolios); };
  });
};

CoinbasePrivate.prototype.movePortfolioFunds = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/portfolios/move-portfolios-funds
  var path="/api/v3/brokerage/portfolios/move_funds";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Products

CoinbasePrivate.prototype.getBestBidAsk = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/products/get-best-bid-ask
  var path="/api/v3/brokerage/best_bid_ask",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"product_ids="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result.pricebooks); };
  });
};

