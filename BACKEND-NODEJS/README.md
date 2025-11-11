# FinTech-App API

## Overview
This project is a comprehensive FinTech API built with Node.js and Express.js, designed to handle core financial operations including user authentication, wallet management, transactions, and invoicing. It utilizes a MongoDB database via Mongoose for data persistence and secures endpoints with JSON Web Tokens (JWT).

## Features
- **Express.js**: For building robust API routing and middleware management.
- **Mongoose**: As an Object Data Modeling (ODM) library for MongoDB interactions.
- **JSON Web Token (JWT)**: To handle secure, token-based user authentication.
- **Bcrypt & Argon2**: For securely hashing and verifying user passwords.
- **Paystack Integration**: For processing payments and funding wallets.
- **Flutterwave Integration**: To facilitate withdrawals to bank accounts(still in progress).
- **Nodemailer**: For sending transactional emails like OTPs and password reset links.

## Getting Started
### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/Noibisjunior/GenzPay-FinTech-Project.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd backend-nodejs
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root directory and add the environment variables listed below.
5.  Start the development server:
    ```bash
    npm run dev
    ```

### Environment Variables
Create a `.env` file in the project's root and populate it with the following variables:

```ini
# Server Configuration
PORT=8009
MONGO_URI=mongodb://localhost:27017/fintech_db

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Email Service (Nodemailer with Gmail SMTP)
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_MAIL=your_email@gmail.com
SMPT_APP_PASS=your_gmail_app_password

# Paystack API Keys
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Flutterwave API Keys
FLW_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx-X
FLW_WEBHOOK_SECRET=your_flutterwave_webhook_secret_hash

# Other Services
EXCHANGE_RATE_API_KEY=your_exchangerateapi_com_api_key
CARD_ENCRYPTION_KEY=a_32_character_long_secure_string
```

## API Documentation
### Base URL
`http://localhost:8009`

### Endpoints

### Authentication & Users

#### POST /api/auth/register
Registers a new user and sends a verification OTP to their email.
**Request**:
```json
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "StrongPassword123!",
  "confirmPassword": "StrongPassword123!",
  "accountType": "individual"
}
```
**Response**:
```json
{
  "status": "success",
  "message": "User registered successfully. An OTP has been sent to your email for verification.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "user@example.com",
      "username": "newuser",
      "accountType": "individual"
    }
  }
}
```
**Errors**:
- `400`: Passwords do not match.
- `400`: User with this email or username already exists.
- `400`: Please provide all the required information.
- `500`: Registration failed.

#### POST /api/auth/login
Authenticates a user and returns a JWT.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```
**Response**:
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "user@example.com",
      "username": "newuser"
    }
  }
}
```
**Errors**:
- `400`: Invalid username or password.
- `500`: Internal server error.

#### GET /api/verify-otp
Verifies the OTP sent to a user's email to activate their account.
**Request**:
`GET /api/verify-otp?email=user@example.com&otp=123456`
**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully. Your account is now active.",
  "user": {
    "email": "user@example.com",
    "username": "newuser",
    "isVerified": true
  }
}
```
**Errors**:
- `400`: Invalid or expired OTP.
- `404`: User not found.
- `500`: Internal server error.

#### POST /api/resend-otp
Resends a new OTP to the user's email.
**Request**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "message": "OTP has been resent to your email"
}
```
**Errors**:
- `400`: Email is required.
- `404`: User not found.
- `500`: Failed to resend OTP.

#### POST /api/auth/forgot-password
Sends a password reset link to the user's email.
**Request**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "message": "Password reset link sent to your email"
}
```
**Errors**:
- `404`: No user found with that email.
- `500`: Error sending the email. Try again later.

#### POST /api/auth/reset-password/:tokens
Resets the user's password using the token from the reset link.
**Request**:
`POST /api/auth/reset-password/a1b2c3d4e5...`
```json
{
  "password": "NewStrongPassword123!",
  "confirmPassword": "NewStrongPassword123!"
}
```
**Response**:
```json
{
  "status": 200,
  "message": "Password reset successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "user@example.com",
      "name": "newuser"
    }
  }
}
```
**Errors**:
- `400`: Passwords do not match.
- `400`: Token is invalid or has expired.

#### POST /api/auth/logOut
Logs out the user by clearing the authentication cookie.
**Request**: (No payload)
**Response**:
```json
{
  "status": 200,
  "message": "Logout successful"
}
```
**Errors**: N/A

#### GET /api/auth/me
Retrieves the profile of the currently authenticated user.
**Request**: (No payload)
**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "60c72b2f9b1d8c001f8e4c6d",
    "username": "newuser",
    "email": "user@example.com",
    "accountType": "individual"
  }
}
```
**Errors**:
- `401`: Invalid Token.
- `404`: User not found.
- `500`: Server error.

### Wallets & Balances

#### GET /api/balance
Finds or creates a wallet for the authenticated user.
**Request**: (No payload)
**Response**:
```json
{
  "data": {
    "_id": "60c72b2f9b1d8c001f8e4c6d",
    "userId": "60c72b2f9b1d8c001f8e4c6c",
    "currency": "NGN",
    "balance": 0,
    "createdAt": "2023-10-18T12:00:00.000Z",
    "updatedAt": "2023-10-18T12:00:00.000Z"
  }
}
```
**Errors**:
- `500`: Server error.

#### GET /api/wallets/balance
Retrieves the current balance for a specified currency.
**Request**:
`GET /api/wallets/balance?currency=USD`
**Response**:
```json
{
  "status": 200,
  "message": "Balance retrieved successfully",
  "data": {
    "balance": "500",
    "currency": "USD"
  }
}
```
**Errors**:
- `400`: Currency query parameter is required.
- `404`: No balance found for currency: [currency].
- `500`: Server error.

#### POST /api/wallets/send
Sends money from the user's wallet.
**Request**:
```json
{
  "amount": 100,
  "accountType": "wallet",
  "accountID": "recipientUserID",
  "currency": "USD",
  "receivingCurrency": "NGN",
  "description": "Payment for services"
}
```
**Response**:
```json
{
  "status": 201,
  "message": "You have successfully sent your fund",
  "data": {
    "id": "60c72b2f9b1d8c001f8e4c6e",
    "transactionDate": "2023-10-18T12:00:00.000Z",
    "userId": "60c72b2f9b1d8c001f8e4c6c",
    "amountReceived": 150000,
    "receivingCurrency": "NGN",
    "amount": 100,
    "description": "Payment for services",
    "accountType": "wallet",
    "accountID": "recipientUserID"
  }
}
```
**Errors**:
- `400`: Missing required fields.
- `400`: Insufficient funds.
- `400`: Unsupported currency conversion.
- `500`: Server error.

### Payment Processing

#### POST /api/payment/initiate
Initializes a payment transaction via Paystack to fund a wallet.
**Request**:
```json
{
  "email": "user@example.com",
  "amount": 5000,
  "currency": "NGN",
  "receivingCurrency": "NGN",
  "accountID": "some_account_id",
  "accountType": "bank",
  "description": "Wallet funding"
}
```
**Response**:
```json
{
  "message": "Payment initiated",
  "data": {
    "authorization_url": "https://checkout.paystack.com/.....",
    "reference": "TX-1678886400000-1234"
  }
}
```
**Errors**:
- `500`: Could not initiate payment.

#### GET /api/verify-payment
Verifies a Paystack payment and credits the user's wallet.
**Request**:
`GET /api/verify-payment?reference=TX-1678886400000-1234`
**Response**:
```json
{
  "success": true,
  "message": "Payment verified and wallet credited"
}
```
**Errors**:
- `400`: Missing payment reference.
- `400`: Transaction not successful.
- `404`: Transaction not found.
- `409`: Transaction already processed.
- `500`: Could not verify payment.

#### POST /api/payment/withdraw
Initiates a withdrawal from the user's wallet to a bank account via Flutterwave.
**Request**:
```json
{
  "amount": 5000,
  "account_number": "0123456789",
  "bank_code": "058",
  "beneficiary_name": "John Doe",
  "narration": "Wallet withdrawal",
  "debit_currency": "NGN"
}
```
**Response**:
```json
{
  "message": "Transfer simulated successfully (Sandbox Mode)",
  "data": {
    "id": 12345,
    "status": "NEW",
    "reference": "TX-1678886400000-5678",
    "amount": 5000
  }
}
```
**Errors**:
- `400`: Missing required fields.
- `400`: Insufficient wallet balance.
- `404`: Wallet not found.
- `500`: Transfer failed.

#### GET /api/payment/banks
Retrieves a list of all supported banks from Flutterwave.
**Request**: (No payload)
**Response**:
```json
{
  "status": true,
  "message": "Banks fetched successfully",
  "data": [
    {
      "id": 21,
      "code": "058",
      "name": "Guaranty Trust Bank"
    }
  ]
}
```
**Errors**:
- `500`: Failed to fetch banks.

### Transactions

#### GET /api/transactions
Retrieves a paginated list of transactions for the authenticated user.
**Request**:
`GET /api/transactions?page=0&size=10&status=success&search=services`
**Response**:
```json
{
  "status": 200,
  "message": "Transactions fetched successfully",
  "pagination": {
    "total": 1,
    "page": 0,
    "size": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "data": [
    {
      "id": "60c72b2f9b1d8c001f8e4c6e",
      "transactionDate": "2023-10-18T12:00:00.000Z",
      "userId": "60c72b2f9b1d8c001f8e4c6c",
      "amount": 100,
      "status": "success",
      "type": "credit"
    }
  ]
}
```
**Errors**:
- `500`: Server error while fetching transactions.

#### GET /api/transactions/:id
Retrieves a single transaction by its ID.
**Request**:
`GET /api/transactions/60c72b2f9b1d8c001f8e4c6e`
**Response**:
```json
{
  "status": 200,
  "message": "Transaction retrieved successfully",
  "data": {
    "id": "60c72b2f9b1d8c001f8e4c6e",
    "transactionDate": "2023-10-18T12:00:00.000Z",
    "userId": "60c72b2f9b1d8c001f8e4c6c",
    "amount": 100,
    "status": "success",
    "type": "credit"
  }
}
```
**Errors**:
- `404`: Transaction not found or unauthorized.
- `500`: Server error while retrieving transaction.

### Bank Accounts

#### GET /api/accounts
Retrieves all bank accounts linked to the user.
**Request**: (No payload)
**Response**:
```json
{
  "status": 200,
  "message": "All balances retrieved successfully",
  "data": {
    "accounts": [
      {
        "currency": "USD",
        "accountHolder": "John Doe",
        "bankName": "Dummy Bank",
        "accountNumber": "1234567890",
        "routingNumber": "0987654321",
        "accountType": "Checking"
      }
    ]
  }
}
```
**Errors**:
- `500`: Server error.

### Virtual Cards

#### POST /api/createCard
Creates a new virtual card for the user.
**Request**:
```json
{
  "name": "John Doe",
  "type": "Debit",
  "brand": "Mastercard"
}
```
**Response**:
```json
{
  "status": 201,
  "message": "Card created successfully",
  "data": {
    "reference": "mock_ref_1678886400000",
    "card_reference": "mock_card_ref_1678886400000",
    "type": "Debit",
    "currency": "USD",
    "holderName": "John Doe",
    "brand": "Mastercard",
    "status": "active"
  }
}
```
**Errors**:
- `500`: Failed to create card.

#### GET /api/getAllCards
Retrieves a paginated list of all virtual cards for the user.
**Request**:
`GET /api/getAllCards?page=0&size=10`
**Response**:
```json
{
  "status": 201,
  "message": "Retrieved all paginated cards successfully",
  "data": [
    {
      "_id": "60c72b2f9b1d8c001f8e4c70",
      "reference": "mock_ref_1678886400000",
      "holderName": "John Doe",
      "brand": "Mastercard",
      "status": "active"
    }
  ]
}
```
**Errors**:
- `404`: No cards found for user.
- `500`: Server error.

#### GET /api/cards/:id
Retrieves a single virtual card by its ID.
**Request**:
`GET /api/cards/60c72b2f9b1d8c001f8e4c70`
**Response**:
```json
{
  "status": 201,
  "message": "Retrieved a single card successfully",
  "data": {
    "reference": "mock_ref_1678886400000",
    "holderName": "John Doe",
    "brand": "Mastercard",
    "status": "active"
  }
}
```
**Errors**:
- `404`: Card not found.
- `500`: Server error.

#### DELETE /api/card/:id
Deletes a virtual card by its ID.
**Request**:
`DELETE /api/card/60c72b2f9b1d8c001f8e4c70`
**Response**:
```json
{
  "status": 200,
  "message": "card deleted successfully",
  "data": {}
}
```
**Errors**:
- `404`: card not found.
- `500`: Server error.

### Invoices

#### POST /api/userInvoices
Creates a new invoice for the authenticated user.
**Request**:
```json
{
  "customer": {
    "name": "Client Corp",
    "email": "client@corp.com"
  },
  "items": [
    {
      "description": "Web Development Service",
      "quantity": 1,
      "amount": 1500
    }
  ],
  "currency": "USD",
  "issueDate": "2023-10-18",
  "dueDate": "2023-11-18",
  "status": "pending"
}
```
**Response**:
```json
{
  "status": 201,
  "message": "Invoice created successfully",
  "data": {
    "shareable": "https://yourdomain.com/invoices/60c72b2f9b1d8c001f8e4c71",
    "customer": { "name": "Client Corp", "email": "client@corp.com" },
    "currency": "USD",
    "status": "pending"
  }
}
```
**Errors**:
- `500`: Server error.

#### GET /api/getAllInvoices
Retrieves all invoices for the user with optional search and pagination.
**Request**:
`GET /api/getAllInvoices?page=0&size=10&terms=Client`
**Response**:
```json
{
  "status": 200,
  "message": "Retrieved all paginated searched invoices successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8c001f8e4c71",
      "shareable": "<https://link-to-view-invoice.com/60c72b2f9b1d8c001f8e4c71>",
      "customer": { "name": "Client Corp", "email": "client@corp.com" },
      "Status": "pending"
    }
  ]
}
```
**Errors**:
- `500`: Server error.

#### GET /api/invoices/:id
Retrieves a single invoice by ID.
**Request**:
`GET /api/invoices/60c72b2f9b1d8c001f8e4c71`
**Response**:
```json
{
  "status": 200,
  "message": "Invoice retrieved successfully",
  "data": {
    "_id": "60c72b2f9b1d8c001f8e4c71",
    "userId": "60c72b2f9b1d8c001f8e4c6c",
    "customer": { "name": "Client Corp", "email": "client@corp.com" },
    "status": "pending"
  }
}
```
**Errors**:
- `404`: Invoice not found.
- `500`: Server error.

#### PUT /api/invoices/:id
Updates an existing invoice.
**Request**:
`PUT /api/invoices/60c72b2f9b1d8c001f8e4c71`
```json
{
  "status": "due"
}
```
**Response**:
```json
{
  "status": 200,
  "message": "Invoice updated successfully",
  "data": {
    "_id": "60c72b2f9b1d8c001f8e4c71",
    "status": "due"
  }
}
```
**Errors**:
- `404`: Invoice not found.
- `500`: Server error.

#### DELETE /api/invoices/:id
Deletes an invoice by ID.
**Request**:
`DELETE /api/invoices/60c72b2f9b1d8c001f8e4c71`
**Response**:
```json
{
  "status": 200,
  "message": "Invoice deleted successfully",
  "data": {}
}
```
**Errors**:
- `404`: Invoice not found.
- `500`: Server error.

### Webhooks

#### POST /api/webhooks/paystack
Handles incoming webhook events from Paystack to confirm transactions.
**Request**: (Payload sent by Paystack)
**Response**:
- `200`: Webhook received and verified.
**Errors**:
- `401`: Invalid signature.

## License

This project is open-source. Feel free to use and modify it.

## Author

**Noibisjunior**

-   **GitHub**: [@Noibisjunior](https://github.com/Noibisjunior)
-   **Twitter**: [@ClericCoder](https://x.com/clericcoder)
-   **LinkedIn**: [Abdulsalaam-noibi](https://linkedin.com/in/abdulsalaam-noibi)

<br/>

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)