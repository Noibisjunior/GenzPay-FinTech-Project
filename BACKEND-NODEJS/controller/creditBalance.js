const Wallet =  require('../models/wallet');

exports.creditWallet = async (userId, amount) => {
  await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { upsert: true, new: true }
  );
};
