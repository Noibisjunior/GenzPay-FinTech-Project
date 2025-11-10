const Transaction = require("../models/transactionModel");

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 0, size = 10, search = "", status } = req.query;

    // Convert page and size to integers safely
    const pageInt = Math.max(parseInt(page), 0);
    const sizeInt = Math.max(parseInt(size), 1);

    
    const filter = { userId }; // restrict to logged-in user

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sender: { $regex: search, $options: "i" } },
        { recipient: { $regex: search, $options: "i" } },
      ];
    }

    if (status && ["pending", "success", "failed"].includes(status.toLowerCase())) {
      filter.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    // Parallel queries for performance
    const [totalTransactions, transactions] = await Promise.all([
      Transaction.countDocuments(filter),
      Transaction.find(filter)
        .sort({ transactionDate: -1 }) // newest first
        .skip(pageInt * sizeInt)
        .limit(sizeInt),
    ]);

    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id,
      transactionDate: tx.transactionDate || tx.paidAt,
      userId: tx.userId,
      amount: tx.amount,
      amountReceived: tx.amountReceived,
      receivingCurrency: tx.receivingCurrency,
      status: tx.status,
      type: tx.type,
      sender: tx.sender,
      recipient: tx.recipient,
    }));

    return res.status(200).json({
      status: 200,
      message: "Transactions fetched successfully",
      pagination: {
        total: totalTransactions,
        page: pageInt,
        size: sizeInt,
        totalPages: Math.ceil(totalTransactions / sizeInt),
        hasNext: pageInt + 1 < Math.ceil(totalTransactions / sizeInt),
        hasPrev: pageInt > 0,
      },
      data: formattedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching transactions",
      error: error.message,
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOne({ _id: transactionId, userId });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: "Transaction not found or unauthorized",
      });
    }

    const transactionData = {
      id: transaction._id,
      transactionDate: transaction.transactionDate || transaction.paidAt,
      userId: transaction.userId,
      amount: transaction.amount,
      amountReceived: transaction.amountReceived,
      receivingCurrency: transaction.receivingCurrency,
      status: transaction.status,
      type: transaction.type,
      sender: transaction.sender,
      recipient: transaction.recipient,
    };

    return res.status(200).json({
      status: 200,
      message: "Transaction retrieved successfully",
      data: transactionData,
    });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error while retrieving transaction",
      error: error.message,
    });
  }
};

module.exports = { getAllTransactions, getTransactionById };
