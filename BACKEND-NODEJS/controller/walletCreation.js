const Wallet = require ('../models/wallet');

exports.CreateWallet = async (req, res) => {
  try {
    const userId = req.user.id; // from the authentication middleware 
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId });
      await wallet.save();
    }

    res.status(200).json({ data: wallet });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get wallet by userId
exports.getWalletsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const wallets = await Wallet.find({ userId });
    if (!wallets || wallets.length === 0) {
      return res.status(404).json({ message: "No wallets found" });
    }

    res.status(200).json({ status: "success", data: wallets });

  } catch (err) {
    console.error("Fetch wallets error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
