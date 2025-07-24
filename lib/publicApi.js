const
  axios = require('axios');

var CoinbasePublic = function() {
  this.endPoint = "https://api.coinbase.com";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new CoinbasePublic();
};

CoinbasePublic.prototype.query = async function(options) {

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

CoinbasePublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return await this.query(options);
};

// Public

CoinbasePublic.prototype.getMarketTrades = async function(id,options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-market-trades
  var path="/api/v3/brokerage/market/products/"+id+"/ticker",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result.trades); };
  });
};

CoinbasePublic.prototype.getProduct = async function(id,options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product
  var path="/api/v3/brokerage/market/products/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result); };
  });
};

CoinbasePublic.prototype.getProductBook = async function(options) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product-book
  var path="/api/v3/brokerage/market/product_book",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result.pricebook); };
  });
};

CoinbasePublic.prototype.getProductCandles = async function(id,options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-public-product-candles
  var path="/api/v3/brokerage/market/products/"+id+"/candles",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result.candles); };
  });
};

CoinbasePublic.prototype.getServerTime = async function() { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/get-server-time
  const path="/api/v3/brokerage/time";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result); };
  });
};

CoinbasePublic.prototype.listProducts = async function(options={}) { // https://docs.cdp.coinbase.com/api-reference/advanced-trade-api/rest-api/public/list-public-products
  var path="/api/v3/brokerage/market/products",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error")) { reject(result); } else { resolve(result.products); };
  });
};

