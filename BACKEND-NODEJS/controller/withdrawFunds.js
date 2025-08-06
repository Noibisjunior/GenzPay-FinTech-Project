const axios = require("axios");
const Wallet = require("../models/wallet");
const Transaction = require("../models/transactionModel");
require("dotenv").config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

exports.sendToBank = async (req, res) => {
  try {
    const { userId, amount, account_number, bank_code } = req.body;

    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Creating transfer recipient
    const recipientRes = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: "User Transfer",
        account_number,
        bank_code,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const recipientCode = recipientRes.data.data.recipient_code;

    // Initiating transfer
    const transferRes = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100,
        recipient: recipientCode,
        reason: "Wallet withdrawal",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    // Deduct balance & log transaction
    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId,
      type: "debit",
      amount,
      status: "pending",
      method: "bank_transfer",
      reference: transferRes.data.data.reference,
      details: {
        account_number,
        bank_code,
        recipient_code: recipientCode,
      },
    });

    res.status(200).json({ message: "Transfer initiated", data: transferRes.data.data });

  } catch (error) {
    console.error("Send to bank error:", error.response?.data || error.message);
    res.status(500).json({ error: "Transfer failed" });
  }
};
