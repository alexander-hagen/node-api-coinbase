const
  axios = require('axios');

var RevolutPublic = function() {
  this.endPoint = "https://api.revolut.com";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new RevolutPublic();
};

RevolutPublic.prototype.query = async function(options) {

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

RevolutPublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return await this.query(options);
};

// Public Market Data

RevolutPublic.prototype.getLastTrades = async function() { // https://developer.revolut.com/docs/x-api/get-last-trades
  var path="curl -L -X GET '/api/1.0/public/last-trades";
  return await new Promise(async (resolve, reject) => {
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result.trades); };
  });
};

RevolutPublic.prototype.getOrderbook = async function(symbol) { // https://developer.revolut.com/docs/x-api/get-public-order-book
  var path="/api/1.0/public/order-book/"+symbol;
    const result=await this.getQuery(path,{});
    if(result.hasOwnProperty("error_id")) { reject(result); } else { resolve(result); };
  });
};
