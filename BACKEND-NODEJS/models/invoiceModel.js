const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
     },
    customer: {
    type: String,
  },
  currency: {
    type: String,
  },
  status: {
    type: String,
    enumeration: ['due', 'overdue', 'pending','draft'],
  },
  dueDate: {
    type: Date,
  },
  issueDate: {
    type: Date,
  },

  items: [
    {
      description: String,
      quantity: Number,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
