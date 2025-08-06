const Recipient = require("../models/reciepient");


exports.createRecipient = async (req, res) => {
  try {
    const {
      userId, currency, type, accountName, accountNumber, bank,
      country, state, city, street, postalCode
    } = req.body;

    if (!userId || !currency || !type || !accountName || !accountNumber || !bank) {
      return res.status(400).json({ message: "Missing required fields" });
    } 

    const newRecipient = await Recipient.create({
      userId, currency, type, accountName, accountNumber, bank,
      country, state, city, street, postalCode
    });

    res.status(201).json({ status: "success", data: newRecipient });

  } catch (err) {
    console.error("Create recipient error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all recipients for a user
exports.getRecipientsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const recipients = await Recipient.find({ userId });

    res.status(200).json({ status: "success", data: recipients });

  } catch (err) {
    console.error("Fetch recipients error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
