const axios = require("axios");
const Wallet = require("../models/wallet");
const Transaction = require("../models/transactionModel");
require("dotenv").config();
const mongoose = require("mongoose");

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY; 
const FLW_BASE_URL = "https://api.flutterwave.com/v3";



exports.sendToBank = async (req, res) => {
  try {
    const {
      amount,
      account_number,
      bank_code,
      beneficiary_name,
      narration,
      debit_currency,
      destination_branch_code,
      callback_url,
    } = req.body;

    if (!amount || !account_number || !bank_code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    if (wallet.balance < amount)
      return res.status(400).json({ error: "Insufficient wallet balance" });

    
    const reference = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    //  Build transfer payload for Flutterwave Sandbox
    const transferPayload = {
      account_bank: bank_code,
      account_number,
      amount,
      currency: "NGN",
      debit_currency: debit_currency || "NGN",
      narration: narration || "Wallet withdrawal (Sandbox simulation)",
      beneficiary_name: beneficiary_name || "Sandbox User",
      reference,
      destination_branch_code: destination_branch_code || "GH280103",
    }

    console.log("Initiating transfer:", transferPayload);

    // Initiate simulated transfer with Flutterwave Sandbox
    const transferRes = await axios.post(
      `${FLW_BASE_URL}/transfers`,
      transferPayload,
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 20000,
      }
    );

    const { status, message, data } = transferRes.data;

    
    if (status !== "success") {
      return res.status(400).json({
        error: "Transfer failed",
        details: message || "Unknown error from Flutterwave Sandbox",
      });
    }

  
    wallet.balance -= amount;
    await wallet.save();

    
    await Transaction.create({
      userId,
      type: "debit",
      amount,
      status: "pending",
      method: "bank_transfer",
      reference,
      details: {
        account_number,
        bank_code,
        beneficiary_name: transferPayload.beneficiary_name,
        flw_transfer_id: data?.id,
      },
    });

    
    res.status(200).json({
      message: "Transfer simulated successfully (Sandbox Mode)",
      data,
    });
  } catch (error) {
    console.error(
      "Send to bank error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Transfer failed",
      details: error.response?.data || error.message,
    });
  }
};


exports.GetAllBanks = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.flutterwave.com/v3/banks/NG?include_provider_type=1',
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }
    );

    res.json({
      status: true,
      message: 'Banks fetched successfully',
      data: response.data.data,
    });
  } catch (error) {
    console.error('Error fetching banks:', error.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch banks',
      details: error.response?.data || error.message,
    });
  }
}

