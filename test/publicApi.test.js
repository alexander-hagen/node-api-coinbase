const
  coinbase = require("../index.js");

const
  publicAPI=new coinbase.publicApi(),
  timeout=publicAPI.timeout;

const
  symbol="BTC-USD";

// Normal requests

describe('Market Data', () => {

  test('Test getMarketTrades() function', async () => {
    const result=await publicAPI.getMarketTrades(symbol);
    expect(result).toBeInstanceOf(Array);
  }, timeout);

  test('Test getProduct() function', async () => {
    const result=await publicAPI.getProduct(symbol);
    expect(result).toHaveProperty("product_id");
  }, timeout);

  test('Test getProductBook() function', async () => {
    const result=await publicAPI.getProductBook({product_id: symbol});
    expect(result).toHaveProperty("product_id");
  }, timeout);

  test('Test getProductCandles() function', async () => {
    const now=Math.floor(new Date() / 1000 /60) * 60;
    const result=await publicAPI.getProductCandles(symbol,{
      start: now,
      end: (now+60),
      granularity: "ONE_MINUTE"
    });
    expect(result).toBeInstanceOf(Array);
  }, timeout);

  test('Test getServerTime() function', async () => {
    const result=await publicAPI.getServerTime();
    expect(result).toHaveProperty("epochMillis");
  }, timeout);

  test('Test listProducts() function', async () => {
    const result=await publicAPI.listProducts();
    expect(result).toBeInstanceOf(Array);
  }, timeout);

});
