const Account = require('../models/AccountModel');
const Transaction = require('../models/transactionModel');

// Handling webhook to confirm deposit
const handleDepositWebhook = async (req, res) => {
  const { transactionId, status, amount, currency, userId } = req.body;

  try {
    // Check if the transaction exists and is pending
    const transaction = await Transaction.findOne({ _id: transactionId, status: 'pending' });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: 'Transaction not found or already processed'
      });
    }

    // Update transaction status based on webhook confirmation
    transaction.status = status;
    await transaction.save();

    // If deposit was successful, then update user's balance
    if (status === 'successful') {
      const account = await Account.findOne({ userId });
      account.balance = (account.balance || 0) + amount; 
      await account.save();
    }

    res.status(200).json({
      status: 200,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      status: 500,
      message: 'Error processing webhook'
    });
  }
};  

exports.handleFlutterwaveWebhook = async (req, res) => {
  try {
    const secretHash = process.env.FLW_WEBHOOK_SECRET; 
    const signature = req.headers["verif-hash"];

    // Validate Flutterwave signature 
    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = req.body;
    console.log("Flutterwave Webhook Event:", event);

    // Only process transfer events
    if (event.event === "transfer.completed") {
      const { reference, status } = event.data;

      const transaction = await Transaction.findOne({ reference });
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });

      transaction.status = status;
      await transaction.save();

      // Update wallet balance if refunding failed transfer
      if (status === "failed") {
        const wallet = await Wallet.findOne({ userId: transaction.userId });
        if (wallet) {
          wallet.balance += transaction.amount;
          await wallet.save();
        }
      }

      console.log(`Transaction ${reference} updated to ${status}`);
    }

    res.sendStatus(200); 
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.sendStatus(500);
  }
};

module.exports = { handleDepositWebhook };
