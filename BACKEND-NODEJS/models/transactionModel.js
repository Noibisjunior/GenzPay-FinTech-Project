const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String},
  amount: { type: Number},
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  type: { type: String, enum: ["credit", "debit"], required: true },
  accountID: { type: String },
  currency: { type: String},
  amountReceived: { type: Number },
  reference: { type: String, required: true, unique: true },
  description: { type: String },
  channel: { type: String },
  details: { type: Object }, 
  paidAt: { type: Date }},
  { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
