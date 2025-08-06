const paystack = require('../utils/paystack.js');
require("dotenv").config();
const axios = require('axios');
const Transaction = require('../models/transactionModel.js');
const { creditWallet } = require('./creditBalance.js');
// const User = require('../models/userModel'); 


exports.initializeSendMoney = async (req, res) => {
  const { email, amount, currency, receivingCurrency, accountID, accountType, description } = req.body;
  const userId = req.user.id;
  const amountInKobo = amount * 100;

  try {
    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amountInKobo,
      callback_url: "http://localhost:5173/payment-success",
      metadata: {
        email,
        userId,
        currency,
        receivingCurrency,
        accountID,
        accountType,
        description,
      },
    });

    const { authorization_url, reference } = response.data.data;

    // Save transaction
    await Transaction.create({
      userId,
      reference,
      amount,
      status: 'pending',
    });

    return res.status(200).json({
      message: 'Payment initiated',
      data: { authorization_url, reference },
    });

  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Could not initiate payment' });
  }
};

// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: "Missing payment reference" });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const payment = response.data.data;

    if (payment.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Transaction not successful' });
    }

    // Find transaction
    const existingTransaction = await Transaction.findOne({ reference });
    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (existingTransaction.status === 'success') {
      return res.status(409).json({ message: 'Transaction already processed' });
    }

    // Get user ID from metadata
    const userId = payment.metadata.userId;
    const amountPaid = payment.amount / 100;

    // Update transaction
    existingTransaction.status = 'success';
    existingTransaction.channel = payment.channel;
    existingTransaction.currency = payment.currency;
    existingTransaction.paidAt = payment.paid_at;
    await existingTransaction.save();

    // Credit wallet
    await creditWallet(userId, amountPaid);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and wallet credited',
    });

  } catch (err) {
    console.error("Verification error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Could not verify payment",
    });
  }
};
