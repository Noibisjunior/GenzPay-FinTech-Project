const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware.js');

const {getUserAccounts} = require('../controller/accountController.js')
const {getInvoiceSummary} = require('../controller/invoiceController.js')
const {getCurrentExchangeRates} = require('../controller/ExchangeRateController.js')
const {getActiveVirtualCard } = require('../controller/virtualCard.js')
const { getAccountById } = require('../controller/IndividualAccount.js');
const { createInvoice } = require('../controller/userInvoice.js');
const {  getAllInvoices } = require('../controller/userInvoice.js');
const {  viewDraftInvoices } = require('../controller/userInvoice.js');
const {  pendingInvoices } = require('../controller/userInvoice.js');
const {  getDueInvoices } = require('../controller/userInvoice.js');
const {  overDueInvoices } = require('../controller/userInvoice.js');
const {  updateInvoice }  = require('../controller/userInvoice.js');
const {getInvoiceById}  = require ('../controller/userInvoice.js');
const {  deleteInvoice } = require('../controller/userInvoice.js');
const {  createCard } = require('../controller/card.js');
const {  getAllCards } = require('../controller/card.js');
const {   getCardById } = require('../controller/card.js');
const {   getCurrentBalance } = require('../controller/walletBalance.js');
const {   getAccountStatement  } = require('../controller/walletBalance.js');
const {  deleteCard } = require('../controller/card.js');
const {  getIndividualAccountDetails } = require('../controller/walletDetails.js');
const {  getIncomesAndExpenses  } = require('../controller/walletDetails.js');
const {  sendMoney  } = require('../controller/fundwallet.js');
const {  convertCurrency  } = require('../controller/fundwallet.js');
const { getAllTransactions  } = require('../controller/Transaction.js');
const { getTransactionById  } = require('../controller/Transaction.js');
const {  getCurrentUser  } = require('../controller/userProfile.js');
const {  editUserProfile  } = require('../controller/userProfile.js');
const {  addBeneficiary  } = require('../controller/beneficiary.js');
const {  searchBeneficiaries  } = require('../controller/beneficiary.js');
const {  deleteBeneficiary  } = require('../controller/beneficiary.js');
const {  activate2FA  } = require('../controller/2FA.js');
const {  verifyUser  } = require('../controller/verifyUser.js');
const {  getNotificationCount  } = require('../controller/notification.js');
const {  getNotificationById } = require('../controller/notification.js');
const {  updateNotificationStatus } = require('../controller/notification.js');
const {  deleteNotification } = require('../controller/notification.js');
const {verifyOTP,resendOTP} = require('../controller/verifyOTP.js')
const { CreateWallet, getWalletsByUserId } = require("../controller/walletCreation.js");
const {initializeSendMoney} = require('../controller/initializeFundWallet.js')
const {verifyPayment} = require('../controller/initializeFundWallet.js')
const { sendToBank } = require("../controller/withdrawFunds.js");
const {GetAllBanks} = require("../controller/withdrawFunds.js");




router.post('/userInvoices', verifyToken, createInvoice);
router.post('/createCard', verifyToken, createCard);
router.post('/wallets/send', verifyToken, sendMoney);
router.post('/wallets/convert', verifyToken, convertCurrency);
router.post('/users/:id/beneficiaries', verifyToken, addBeneficiary);
router.post('/users/2fa', verifyToken, activate2FA);
router.post('/verification', verifyToken, verifyUser);
router.post('/resend-otp', resendOTP);
router.post('/payment/initiate', verifyToken, initializeSendMoney);
router.post('/payment/withdraw', verifyToken, sendToBank);


//  GET ROUTES 
router.get('/balance', verifyToken, CreateWallet);
router.get('/accounts', verifyToken, getUserAccounts);
router.get('/invoices/summary', verifyToken, getInvoiceSummary);

router.get('/exchange-rates', getCurrentExchangeRates);
router.get('/cards', verifyToken, getActiveVirtualCard);
router.get('/accounts/:id', getAccountById);
router.get('/getAllInvoices', verifyToken, getAllInvoices);
router.get('/viewDraftInvoices', verifyToken, viewDraftInvoices);
router.get('/pendingInvoices', verifyToken, pendingInvoices);
router.get('/dueInvoices', verifyToken, getDueInvoices);
router.get('/overdueInvoices', verifyToken, overDueInvoices);
router.get('/invoices/:id', verifyToken, getInvoiceById);

router.get('/getAllCards', verifyToken, getAllCards);
router.get('/cards/:id', verifyToken, getCardById);

router.get('/wallets/balance', verifyToken, getCurrentBalance);
router.get('/wallets/statements', verifyToken, getAccountStatement);
router.get('/wallets/accounts/:id', verifyToken, getIndividualAccountDetails);
router.get('/wallets/expenses-incomes', verifyToken, getIncomesAndExpenses);

router.get('/transactions', verifyToken, getAllTransactions);
router.get('/transactions/:id', verifyToken, getTransactionById);

router.get('/currentUser', verifyToken, getCurrentUser);
router.get('/users/:id', verifyToken, editUserProfile);
router.get('/beneficiaries', verifyToken, searchBeneficiaries);

router.get('/notifications/count', verifyToken, getNotificationCount);
router.get('/notifications/:id', verifyToken, getNotificationById);

router.get('/verify-otp', verifyOTP);
router.get('/wallets/:userId', getWalletsByUserId);

router.get('/verify-payment', verifyPayment);
router.get('/payment/banks', GetAllBanks);


//  PUT ROUTES 
router.put('/invoices/:id', verifyToken, updateInvoice);
router.put('/notifications/:id', verifyToken, updateNotificationStatus);


// DELETE ROUTES 
router.delete('/invoices/:id', verifyToken, deleteInvoice);
router.delete('/beneficiaries/:id', verifyToken, deleteBeneficiary);
router.delete('/card/:id', verifyToken, deleteCard);
router.delete('/notification/:id', verifyToken, deleteNotification);


module.exports = router;