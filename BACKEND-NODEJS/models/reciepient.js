const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "NGN", "EUR"],
    required: true,
  },
  type: {
    type: String,
    enum: ["Individual", "Business"],
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  country: String,
  state: String,
  city: String,
  street: String,
  postalCode: String,
}, { timestamps: true });

module.exports = mongoose.model("Recipient", recipientSchema);
