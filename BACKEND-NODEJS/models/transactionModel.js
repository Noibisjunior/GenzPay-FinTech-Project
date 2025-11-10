const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String},
  amount: { type: Number},
  type: { type: String, enum: ["credit", "debit"], required: true },
  accountID: { type: String },
  balanceBefore: { type: Number },
  balanceAfter: { type: Number },
  currency: { type: String},
  amountReceived: { type: Number },
  reference: { type: String, required: true, unique: true },
  description: { type: String },
  method: { type: String, enum: ["wallet", "bank_transfer", "card", "crypto"] },
  details: { type: Object }, 
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
  paidAt: { type: Date }},
  { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
