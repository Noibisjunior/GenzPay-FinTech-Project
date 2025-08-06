const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transactionModel');

const exchangeRates = {
  'USD_NGN': 1500,
  'NGN_USD': 0.00067,
  'USD_USD': 1,
  'NGN_NGN': 1
};

const getUserIdByEmail = async (email) => {
  // Replace with real logic to find userId by email
  const wallet = await Wallet.findOne({ currency: 'NGN', userEmail: email });
  return wallet?.userId || null;
};

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Raw body:', req.body);
    console.log('Webhook Received:', JSON.stringify(req.body, null, 2));

    const secret = process.env.PAYSTACK_SECRET_KEY;

  const hash = crypto.createHmac('sha512', secret)
    .update(req.body)
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    console.log('Invalid signature!');
    return res.status(401).send('Invalid signature');
  }
  
  

  const event = JSON.parse(req.body.toString('utf8'));
console.log('Webhook Verified!');
    console.log('Event:', event);

  if (event.event === 'charge.success') {
    const data = event.data;
    const metadata = data.metadata;

    const userId = await getUserIdByEmail(metadata.email);
    if (!userId) return res.status(404).send('User not found');

    const amount = metadata.amount;
    const currency = metadata.currency;
    const receivingCurrency = metadata.receivingCurrency;

    /* let amountReceived = amount;
    if (currency !== receivingCurrency) {
      const rateKey = `${currency}_${receivingCurrency}`;
      const exchangeRate = exchangeRates[rateKey];
      if (!exchangeRate) return res.status(400).send('Invalid conversion rate');
      amountReceived = amount * exchangeRate;
    }

    // Update wallet
    const wallet = await Wallet.findOne({ userId, currency });
    if (!wallet) return res.status(404).send('Wallet not found');

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId,
      amount,
      amountReceived,
      currency,
      receivingCurrency,
      accountID: metadata.accountID,
      accountType: metadata.accountType,
      description: metadata.description,
      agentPhoneNumber: metadata.agentPhoneNumber,
      transactionDate: new Date()
    });
    console.log('Payment successful for:', paymentData.email);
    return res.status(200).send('Transaction processed');
  }*/

  res.sendStatus(200);
}});

module.exports = router;



 
//  https://a3f2aa6afd38.ngrok-free.app -> http://localhost:8009  


// const express = require('express');
// const router = express.Router();
// const handlePaystackWebhook = async (req, res) => {
//   const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
//   const crypto = require('crypto');

//   const hash = crypto.createHmac('sha512', paystackSecret)
//                      .update(JSON.stringify(req.body))
//                      .digest('hex');

//   if (hash !== req.headers['x-paystack-signature']) {
//     return res.status(400).send('Invalid signature');
//   }

//   const event = req.body;

//   if (event.event === 'charge.success') {
//     const { email, amount, currency, reference } = event.data;

//     // TODO: Add logic to credit user's wallet, mark transaction as complete

//     console.log(`Payment successful for ${email} - ₦${amount / 100}`);
//   }

//   res.sendStatus(200);
// };

// router.post('/api/paystack/webhook', express.json({ verify: rawBodyBuffer }), handlePaystackWebhook);
