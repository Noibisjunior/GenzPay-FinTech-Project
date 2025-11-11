const axios = require('axios');
require('dotenv').config();

const getCurrentExchangeRates = async (req, res) => {
  try {
    const userCurrency = req.user?.localCurrency || 'USD';
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ status: 500, message: "Exchange rate API key is missing" });
    }

    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${userCurrency}`);
    const rates = response.data?.conversion_rates;

    if (!rates || Object.keys(rates).length === 0) {
      return res.status(404).json({ status: 404, message: 'No exchange rates found' });
    }

   
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'NGN', 'JPY'];
    const filteredRates = Object.keys(rates)
      .filter(c => popularCurrencies.includes(c))
      .map(currency => ({
        currency,
        buyPrice: (rates[currency] * 0.98).toFixed(2),
        sellPrice: (rates[currency] * 1.02).toFixed(2),
      }));

    return res.status(200).json({
      status: 200,
      message: 'Exchange rates retrieved successfully',
      data: {
        baseCurrency: userCurrency,
        rates: filteredRates,
      },
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return res.status(500).json({ status: 500, message: 'Server error fetching exchange rates' });
  }
};

module.exports = { getCurrentExchangeRates };
