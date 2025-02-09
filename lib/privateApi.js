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

CoinbasePrivate.prototype.listAccounts = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts
  var path="/api/v3/brokerage/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getAccount = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount
  const path="/api/v3/brokerage/accounts/:"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Products

CoinbasePrivate.prototype.getBest = async function(symbols) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getbestbidask
  const path="/api/v3/brokerage/best_bid_ask?"+symbols.join();
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.createOrder = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_postorder
  const path="/api/v3/brokerage/orders";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.cancelOrders = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelorders
  const path="/api/v3/brokerage/orders/batch_cancel";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.editOrder = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editorder
  const path="/api/v3/brokerage/orders/edit";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.editOrderPreview = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeweditorder
  const path="/api/v3/brokerage/orders/edit_preview";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listOrders = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorders
  var path="/api/v3/brokerage/orders/historical/batch",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listFills = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfills
  var path="/api/v3/brokerage/orders/historical/fills",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getOrder = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorder
  const path="/api/v3/brokerage/orders/historical/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.previewOrder = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeworder
  const path="/api/v3/brokerage/orders/preview",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.closePosition = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_closeposition
  const path="/api/v3/brokerage/orders/close_position",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Portfolios

CoinbasePrivate.prototype.listPortfolios = async function(typ) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfolios
  var path="/api/v3/brokerage/portfolios";
  if(typ!==undefined) { path+="?portfolio_type="+typ; };
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.createPortfolio = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createportfolio
  var path="/api/v3/brokerage/portfolios",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.movePortfolioFunds = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds
  const path="/api/v3/brokerage/portfolios/move_funds";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPortfolioBreakdown = async function(id,options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfoliobreakdown
  var path="/api/v3/brokerage/portfolios/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.deletePortfolio = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_deleteportfolio
  const path="/api/v3/brokerage/portfolios/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("DELETE",path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.editPortfolio = async function(id,options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds
  const path="/api/v3/brokerage/portfolios/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("PUT",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Futures

CoinbasePrivate.prototype.getFuturesBalanceSummary = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmbalancesummary
  const path="/api/v3/brokerage/cfm/balance_summary";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getIntradayMarginSettings = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintradaymarginsetting
  const path="/api/v3/brokerage/cfm/intraday/margin_setting";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.setIntradayMarginSettings = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_setintradaymarginsetting
  const path="/api/v3/brokerage/cfm/intraday/margin_setting";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getCurrentMarginWindow = async function(typ) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcurrentmarginwindow
  var path="/api/v3/brokerage/cfm/intraday/current_margin_window";
  if(typ!==undefined) { path+="?margin_profile_type="+typ; };
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listFuturesPositions = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmpositions
  const path="/api/v3/brokerage/cfm/positions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getFuturesPositions = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition
  const path="/api/v3/brokerage/cfm/positions/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.scheduleFuturesSweep = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_schedulefcmsweep
  const path="/api/v3/brokerage/cfm/sweeps/schedule";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listFuturesSweeps = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmsweeps
  const path="/api/v3/brokerage/cfm/sweeps";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.cancelPendingFuturesSweep = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelfcmsweep
  const path="/api/v3/brokerage/cfm/sweeps";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("DELETE",path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Perpetuals

CoinbasePrivate.prototype.allocatePortfolio = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_allocateportfolio
  const path="/api/v3/brokerage/intx/allocate";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPerpetualsPortfolioSummary = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition
  const path="/api/v3/brokerage/intx/portfolio/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.listPerpetualsPositions = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxpositions
  const path="/api/v3/brokerage/intx/positions/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPerpetualsPosition = async function(id,symbol) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxposition
  const path="/api/v3/brokerage/intx/positions/"+id+"/"+symbol;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPortfoliosBalances = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxbalances
  const path="/api/v3/brokerage/intx/balances/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.optMultiAssetCollateral = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_intxmultiassetcollateral
  const path="/api/v3/brokerage/intx/multi_asset_collateral";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Fees

CoinbasePrivate.prototype.getTransactionSummary = async function(options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gettransactionsummary
  var path="/api/v3/brokerage/transaction_summary",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Converts

CoinbasePrivate.prototype.createConvertQuote = async function(options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createconvertquote
  const path="/api/v3/brokerage/convert/quote";
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getConvertTrade = async function(id,options={}) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getconverttrade
  var path="/api/v3/brokerage/convert/trade/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.commitConvertTrade = async function(id,options) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade
  const path="/api/v3/brokerage/convert/trade/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.otherQuery("POST",path,options);
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// Payment Methods

CoinbasePrivate.prototype.listPaymentMethods = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethods
  const path="/api/v3/brokerage/payment_methods";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

CoinbasePrivate.prototype.getPaymentMethod = async function(id) { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethod
  const path="/api/v3/brokerage/payment_methods/"+id;
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};

// API

CoinbasePrivate.prototype.getAPIPermissions = async function() { // https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getapikeypermissions
  const path="/api/v3/brokerage/key_permissions";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); }
    else { resolve(result); };
  });
};
