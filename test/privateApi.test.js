const
  dotenv = require("dotenv").config(),
  { toBeEmpty } = require('jest-extended'),
  coinbase = require("../index.js");

expect.extend({ toBeEmpty });

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new coinbase.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

const
  symbol="BTC-USDC";
//  quote="USDC",
//  base="XXBT";
//  limit=5,
//  depth=5;

let account;

describe('Accounts', () => {

  var account;

  test('Test listAccounts() function', async () => {
    const result=await privateAPI.listAccounts();
    account=result.accounts[0];
    expect(result).toHaveProperty("accounts");
  }, timeout);

  test('Test getAccount() function', async () => {
    const result=await privateAPI.getAccount(account.uuid);
    expect(result).toHaveProperty("uuid");
  }, timeout);

});

//describe('Convert', () => {
//
//  var tradeid;
//
//  test('Test createConvertTrade() function', async () => {
//    const result=await privateAPI.createConvertTrade({
//    });
//    tradeid=result.id;
//    expect(result).toHaveProperty("id");
//  }, timeout);
//
//  test('Test getConvertTrade() function', async () => {
//    const result=await privateAPI.getConvertTrade(tradeid);
//    account=result[0];
//    expect(result).toHaveProperty("id");
//  }, timeout);
//
//  test('Test commitConvertTrade() function', async () => {
//    const result=await privateAPI.commitConvertTrade(tradeid);
//    account=result[0];
//    expect(result).toHaveProperty("id");
//  }, timeout);
//
//});

describe('Data API', () => {

  test('Test getAPIKeyPermissions() function', async () => {
    const result=await privateAPI.getAPIKeyPermissions();
    expect(result).toHaveProperty("portfolio_uuid");
  }, timeout);

});

describe('Fees', () => {

  test('Test getTransactionSummary() function', async () => {
    const result=await privateAPI.getTransactionSummary();
    expect(result).toHaveProperty("fee_tier");
  }, timeout);

});

describe('Futures', () => {

  test('Test getCurrentMarginWindow() function', async () => {
    const result=await privateAPI.getCurrentMarginWindow({margin_profile_type: "MARGIN_PROFILE_TYPE_RETAIL_REGULAR" });
    expect(result).toHaveProperty("margin_window");
  }, timeout);

  test('Test getFuturesBalanceSummary() function', async () => {
    const result=await privateAPI.getFuturesBalanceSummary();
    expect(result && typeof result === 'object').toBe(true);
  }, timeout);

  var setting;

  test('Test getIntradayMarginSetting() function', async () => {
    const result=await privateAPI.getIntradayMarginSetting();
    setting=result.setting;
    expect(result).toHaveProperty("setting");
  }, timeout);

  test('Test setIntradayMarginSettings() function', async () => {
    const result=await privateAPI.setIntradayMarginSettings({"setting": setting});
    expect(result).toBeEmpty();
  }, timeout);

  test('Test listFuturesPositions() function', async () => {
    const result=await privateAPI.listFuturesPositions();
    expect(result).toBeInstanceOf(Array);
  }, timeout);

//  test('Test getFuturesPosition() function', async () => { // Needs listProducts first
//    const result=await privateAPI.getFuturesPosition(symbol);
//    expect(result).toHaveProperty("product_id");
//  }, timeout);

//  test('Test scheduleFuturesSweep() function', async () => {
//    const result=await privateAPI.scheduleFuturesSweep();
//    expect(result).toHaveProperty("success");
//  }, timeout);

  test('Test listFuturesSweeps() function', async () => {
    const result=await privateAPI.listFuturesSweeps();
    expect(result).toBeInstanceOf(Array);
  }, timeout);

//  test('Test cancelPendingFuturesSweep() function', async () => {
//    const result=await privateAPI.cancelPendingFuturesSweep();
//    expect(result).toHaveProperty("success");
//  }, timeout);

});

describe('Orders', () => {

  var orderid;

  test('Test previewOrder() function', async () => {
    const request={
      product_id: symbol,
      side: "BUY",
      order_configuration: { limit_limit_gtc: {
        base_size: "0.0001",
        limit_price: "50000",
        post_only: false }
      }
    };
    const result=await privateAPI.previewOrder(request);
    expect(result).toHaveProperty("commission_total");
  }, timeout);

  test('Test createOrder() function', async () => {
    const request={
      product_id: symbol,
      client_order_id: Date.now().toString(),
      side: "BUY",
      order_configuration: { limit_limit_gtc: {
        base_size: "0.0001",
        limit_price: "50000",
        post_only: false }
      }
    };
    const result=await privateAPI.createOrder(request);
    orderid=result.success_response.order_id;
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test('Test getOrder() function', async () => {
    const result=await privateAPI.getOrder(orderid);
    expect(result).toHaveProperty("order");
  }, timeout);

  test('Test editOrderPreview() function', async () => {
    const request={
      order_id: orderid,
      size: "0.00005",
      price: "60000"
    };
    const result=await privateAPI.editOrderPreview(request);
    expect(result).toHaveProperty("commission_total");
  }, timeout);

  test('Test editOrder() function', async () => {
    const request={
      order_id: orderid,
      size: "0.00005",
      price: "60000"
    };
    const result=await privateAPI.editOrder(request);
    expect(result).toHaveProperty("success",true);
  }, timeout);

  test('Test cancelOrders() function', async () => {
    const request={ order_ids: [ orderid ] };
    const result=await privateAPI.cancelOrders(request);
    expect(result).toBeInstanceOf(Array);
  }, timeout);

//  test('Test closePosition() function', async () => {
//    const result=await privateAPI.closePosition();
//    expect(result).toHaveProperty("success",true);
//  }, timeout);

  test('Test listFills() function', async () => {
    const result=await privateAPI.listFills();
    expect(result).toHaveProperty("fills");
  }, timeout);

  test('Test listOrders() function', async () => {
    const result=await privateAPI.listOrders();
    expect(result).toHaveProperty("orders");
  }, timeout);

});

describe('Payment Methods', () => {

  var method;

  test('Test listPaymentMethods() function', async () => {
    const result=await privateAPI.listPaymentMethods();
    method=result[0];
    expect(result).toBeInstanceOf(Array);
  }, timeout);

  test('Test getPaymentMethod() function', async () => {
    const result=await privateAPI.getPaymentMethod(method.id);
    expect(result).toHaveProperty("id",method.id);
  }, timeout);

});

//describe('Perpetuals', () => {

//  test('Test allocatePortfolio() function', async () => {
//    const result=await privateAPI.allocatePortfolio(id);
//    expect(result).toBeEmpty();
//  }, timeout);

//  test('Test getPerpetualsPortfolioSummary() function', async () => {
//    const result=await privateAPI.getPerpetualsPortfolioSummary(id);
//    expect(result).toHaveProperty("portfolio_uuid",id);
//  }, timeout);

//  test('Test getPerpetualsPosition() function', async () => {
//    const result=await privateAPI.getPerpetualsPosition(id, symbol);
//    expect(result).toHaveProperty("portfolio_uuid",id);
//  }, timeout);

//  test('Test getPortfoliosBalances() function', async () => {
//    const result=await privateAPI.getPortfoliosBalances(id);
//    expect(result).toHaveProperty("portfolio_uuid",id);
//  }, timeout);

//  test('Test listPerpetualsPositions() function', async () => {
//    const result=await privateAPI.listPerpetualsPositions();
//    expect(result).toHaveProperty("portfolio_uuid",id);
//  }, timeout);

//  test('Test optMultiAssetCollateral() function', async () => {
//    const result=await privateAPI.optMultiAssetCollateral(id);
//    expect(result).toHaveProperty("multi_asset_collateral_enabled");
//  }, timeout);

//});

describe('Portfolios', () => {

  var portfolio;

//  test('Test createPortfolio() function', async () => {
//    const result=await privateAPI.createPortfolio({"name": "portfolio 1"});
//    expect(result).toHaveProperty("uuid");
//  }, timeout);

//  test('Test deletePortfolio() function', async () => {
//    const result=await privateAPI.deletePortfolio(portfolio.uuid);
//    expect(result).toBeEmpty();
//  }, timeout);

  test('Test listPortfolios() function', async () => {
    const result=await privateAPI.listPortfolios({portfolio_type: "DEFAULT"});
    portfolio=result[0];
    expect(result).toBeInstanceOf(Array);
  }, timeout);

//  test('Test editPortfolio() function', async () => {
//    const result=await privateAPI.editPortfolio(portfolio.uuid,{name: "Default"});
//    expect(result).toHaveProperty("uuid");
//  }, timeout);

  test('Test getPortfolioBreakdown() function', async () => {
    const result=await privateAPI.getPortfolioBreakdown(portfolio.uuid);
    expect(result).toHaveProperty("portfolio");
  }, timeout);

//  test('Test movePortfolioFunds() function', async () => {
//    const result=await privateAPI.movePortfolioFunds(id);
//    expect(result).toHaveProperty("source_portfolio_uuid");
//  }, timeout);

});

describe('Products', () => {

  test('Test getBestBidAsk() function', async () => {
    const result=await privateAPI.getBestBidAsk({"product_ids": [symbol] });
    expect(result).toBeInstanceOf(Array);
  }, timeout);

});
