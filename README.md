# FinTech-App API

## Overview
This is a comprehensive REST API for a modern fintech application, built with Node.js and the Express.js framework. It uses Mongoose as an ODM to interact with a MongoDB database and secures endpoints with JSON Web Tokens (JWT) for authentication.

## Features
- **Express.js**: Serves as the web application framework for building the RESTful API.
- **Mongoose**: Provides an elegant Object Data Modeling (ODM) layer for MongoDB.
- **JSON Web Token (JWT)**: Used for creating access tokens to secure the API endpoints.
- **Bcrypt & Argon2**: Implemented for robust and secure password hashing.
- **Paystack & Flutterwave**: Integrated for handling payment processing, withdrawals, and webhooks.
- **Nodemailer**: Manages email services for functionalities like OTP verification and password resets.
- **Axios**: Utilized for making HTTP requests to external services like exchange rate APIs.

## Getting Started

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/FinTech-App.git
    cd FinTech-App
    ```

2.  **Navigate to the backend directory and install dependencies:**
    ```bash
    cd BACKEND-NODEJS
    npm install
    ```

3.  **Create a `.env` file** in the `BACKEND-NODEJS` root and add the environment variables listed below.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:8009` (or the port specified in your `.env` file).

### Environment Variables
Create a `.env` file in the `BACKEND-NODEJS` directory and add the following variables:

```env
# Server Configuration
PORT=8009

# MongoDB Connection
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fintech?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES=1d

# Email Service (Nodemailer/Gmail)
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_MAIL=youremail@gmail.com
SMPT_APP_PASS=your_gmail_app_password

# Payment Gateway Keys
PAYSTACK_SECRET_KEY=sk_test_...
FLW_SECRET_KEY=FLWSECK_TEST-...
FLW_WEBHOOK_SECRET=your_flutterwave_webhook_secret_hash

# External Services
EXCHANGE_RATE_API_KEY=your_exchangerate_api_key

# Data Encryption
CARD_ENCRYPTION_KEY=your_32_character_card_encryption_key
```

## API Documentation
### Base URL
`http://localhost:8009`

### Endpoints

#### **Authentication & Users**

#### POST /api/auth/register
Registers a new user and sends a verification OTP.
**Request**:
```json
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "accountType": "savings"
}
```
**Response** (Success 200):
```json
{
  "status": "success",
  "message": "User registered successfully. An OTP has been sent to your email for verification.",
  "data": {
    "token": "eyJhbGciOiJI...",
    "user": {
      "email": "user@example.com",
      "username": "newuser",
      "accountType": "savings"
    }
  }
}
```
**Errors**:
- `400`: "Please provide all the required information."
- `400`: "Passwords do not match."
- `400`: "User with this email or username already exists."
- `500`: "Registration failed."

---

#### POST /api/auth/login
Authenticates a user and returns a JWT.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJI...",
    "user": {
      "email": "user@example.com",
      "username": "testuser"
    }
  }
}
```
**Errors**:
- `400`: "Invalid username or password"
- `500`: "Internal server error"

---

#### POST /api/auth/forgot-password
Sends a password reset link to the user's email.
**Request**:
```json
{
  "email": "user@example.com"
}
```
**Response** (Success 200):
```json
{
  "message": "Password reset link sent to your email"
}
```
**Errors**:
- `404`: "No user found with that email"
- `500`: "Error sending the email. Try again later."

---

#### POST /api/auth/reset-password/:tokens
Resets the user's password using the provided token.
**Request**:
```json
{
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Password reset successfully",
  "data": {
    "token": "eyJhbGciOiJI...",
    "user": {
      "email": "user@example.com",
      "name": "testuser"
    }
  }
}
```
**Errors**:
- `400`: "Passwords do not match"
- `400`: "Token is invalid or has expired"

---

#### POST /api/auth/logOut
Logs out the user by clearing the JWT cookie.
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Logout successful"
}
```

---

#### GET /api/auth/me
Retrieves the profile of the currently authenticated user. (Requires authentication)
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "success": true,
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "username": "testuser",
    "email": "user@example.com",
    "accountType": "savings"
  }
}
```
**Errors**:
- `401`: "Invalid Token"
- `404`: "User not found"
- `500`: "Server error"

---

#### GET /api/verify-otp
Verifies the user's account using an OTP sent to their email.
**Request**: Query parameters `?email=user@example.com&otp=123456`
**Response** (Success 200):
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
- `400`: "Invalid or expired OTP"
- `404`: "User not found"

---

#### POST /api/resend-otp
Resends a new OTP to the user's email.
**Request**:
```json
{
  "email": "user@example.com"
}
```
**Response** (Success 200):
```json
{
  "message": "OTP has been resent to your email"
}
```
**Errors**:
- `400`: "Email is required"
- `404`: "User not found"

---
#### **Accounts & Wallets**

#### GET /api/accounts
Retrieves all bank accounts for the authenticated user. (Requires authentication)
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "All balances retrieved successfully",
  "data": {
    "accounts": [
      {
        "currency": "USD",
        "accountHolder": "Default User",
        "bankName": "Dummy Bank",
        "accountNumber": "1234567890",
        "routingNumber": "0987654321",
        "accountType": "Checking",
        "address": "1234 Default Street, Default City, 00000, USA"
      }
    ]
  }
}
```
**Errors**:
- `500`: "Server error"

---

#### GET /api/wallets/balance
Retrieves the current balance for a specific currency wallet. (Requires authentication)
**Request**: Query parameter `?currency=USD`
**Response** (Success 200):
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
- `400`: "Currency query parameter is required"
- `404`: "No balance found for currency: [currency]"
- `500`: "Server error"

---

#### POST /api/wallets/send
Sends money from a user's wallet to a specified account. (Requires authentication)
**Request**:
```json
{
  "amount": 100,
  "accountType": "bank",
  "accountID": "1234567890",
  "currency": "USD",
  "receivingCurrency": "NGN",
  "description": "Payment for services",
  "agentPhoneNumber": "+1234567890"
}
```
**Response** (Success 201):
```json
{
  "status": 201,
  "message": "You have successfully sent your fund",
  "data": {
    "id": "60d0fe4f5311236168a109cc",
    "transactionDate": "2023-10-27T10:00:00.000Z",
    "userId": "60d0fe4f5311236168a109ca",
    "amountReceived": 150000,
    "receivingCurrency": "NGN",
    "amount": 100,
    "description": "Payment for services",
    "accountType": "bank",
    "accountID": "1234567890"
  }
}
```
**Errors**:
- `400`: "Missing required fields"
- `400`: "Insufficient funds"
- `400`: "Unsupported currency conversion"
- `500`: "Server error"

---

#### POST /api/wallets/convert
Converts an amount from one currency to another (simulated). (Requires authentication)
**Request**:
```json
{
  "amount": 100,
  "currency": "NGN"
}
```
**Response** (Success 201):
```json
{
  "status": 201,
  "message": "You have successfully converted your fund",
  "data": {
    "id": "uniqueConversionId",
    "conversionDate": "2023-10-27T10:00:00.000Z",
    "currency": "NGN",
    "amount": 150000
  }
}
```
**Errors**:
- `400`: "Amount and target currency are required"
- `500`: "Server error"

---

#### **Transactions & Payments**

#### POST /api/payment/initiate
Initiates a payment process via Paystack to fund a wallet. (Requires authentication)
**Request**:
```json
{
  "email": "user@example.com",
  "amount": 5000,
  "currency": "NGN",
  "receivingCurrency": "NGN",
  "accountID": "123456",
  "accountType": "wallet",
  "description": "Fund wallet"
}
```
**Response** (Success 200):
```json
{
  "message": "Payment initiated",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "reference": "TX-..."
  }
}
```
**Errors**:
- `500`: "Could not initiate payment"

---

#### GET /api/verify-payment
Verifies a Paystack payment and credits the user's wallet.
**Request**: Query parameter `?reference=TX-...`
**Response** (Success 200):
```json
{
  "success": true,
  "message": "Payment verified and wallet credited"
}
```
**Errors**:
- `400`: "Missing payment reference"
- `400`: "Transaction not successful"
- `404`: "Transaction not found"
- `409`: "Transaction already processed"
- `500`: "Could not verify payment"

---

#### POST /api/payment/withdraw
Initiates a withdrawal to a bank account via Flutterwave. (Requires authentication)
**Request**:
```json
{
  "amount": 5000,
  "account_number": "0123456789",
  "bank_code": "044",
  "beneficiary_name": "John Doe",
  "narration": "Wallet withdrawal",
  "debit_currency": "NGN"
}
```
**Response** (Success 200):
```json
{
  "message": "Transfer simulated successfully (Sandbox Mode)",
  "data": {
    "id": 12345,
    "status": "NEW",
    "reference": "TX-...",
    ...
  }
}
```
**Errors**:
- `400`: "Missing required fields"
- `400`: "Insufficient wallet balance"
- `400`: "Transfer failed"
- `500`: "Transfer failed"

---

#### GET /api/transactions
Retrieves a paginated list of transactions for the authenticated user. (Requires authentication)
**Request**: Query parameters `?page=0&size=10&search=...&status=success`
**Response** (Success 200):
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
      "id": "60d0fe4f5311236168a109cd",
      "transactionDate": "2023-10-27T10:00:00.000Z",
      "userId": "60d0fe4f5311236168a109ca",
      "amount": 5000,
      "status": "successful",
      "type": "credit"
    }
  ]
}
```
**Errors**:
- `500`: "Server error while fetching transactions"

---

#### GET /api/transactions/:id
Retrieves a single transaction by its ID. (Requires authentication)
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Transaction retrieved successfully",
  "data": {
    "id": "60d0fe4f5311236168a109cd",
    "transactionDate": "2023-10-27T10:00:00.000Z",
    "userId": "60d0fe4f5311236168a109ca",
    "amount": 5000,
    "status": "successful",
    "type": "credit"
  }
}
```
**Errors**:
- `404`: "Transaction not found or unauthorized"
- `500`: "Server error while retrieving transaction"

---
#### **Cards**

#### POST /api/createCard
Creates a new virtual card for the user. (Requires authentication)
**Request**:
```json
{
  "name": "My Virtual Card",
  "type": "Debit",
  "brand": "Visa"
}
```
**Response** (Success 201):
```json
{
  "status": 201,
  "message": "Card created successfully",
  "data": {
    "reference": "mock_ref_...",
    "card_reference": "mock_card_ref_...",
    "type": "Debit",
    "currency": "USD",
    "holderName": "My Virtual Card",
    "brand": "Visa",
    "expiry_month": "12",
    "expiry_year": "2028",
    "first_six": "123456",
    "last_four": "7890",
    "status": "active"
  }
}
```
**Errors**:
- `500`: "Failed to create card"

---

#### GET /api/getAllCards
Retrieves a paginated list of all cards for the user. (Requires authentication)
**Request**: Query parameters `?page=0&size=10`
**Response** (Success 201):
```json
{
  "status": 201,
  "message": "Retrieved all paginated cards successfully",
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ce",
      "reference": "mock_ref_...",
      "type": "Debit",
      "holderName": "My Card",
      "brand": "Visa",
      "status": "active"
    }
  ]
}
```
**Errors**:
- `404`: "No cards found for user"
- `500`: "Server error"

---

#### DELETE /api/card/:id
Deletes a specific card by its ID. (Requires authentication)
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "card deleted successfully",
  "data": {}
}
```
**Errors**:
- `404`: "card not found"
- `500`: "Server error"

---
#### **Invoices**

#### POST /api/userInvoices
Creates a new invoice for the authenticated user. (Requires authentication)
**Request**:
```json
{
  "customer": "Client Name",
  "items": [
    {
      "description": "Web Development",
      "quantity": 1,
      "amount": 1500
    }
  ],
  "currency": "USD",
  "issueDate": "2023-11-01",
  "dueDate": "2023-11-15",
  "status": "draft"
}
```
**Response** (Success 201):
```json
{
  "status": 201,
  "message": "Invoice created successfully",
  "data": {
    "shareable": "https://yourdomain.com/invoices/...",
    "customer": "Client Name",
    "items": [...],
    "currency": "USD",
    "issueDate": "2023-11-01T00:00:00.000Z",
    "dueDate": "2023-11-15T00:00:00.000Z",
    "status": "draft"
  }
}
```
**Errors**:
- `500`: "Server error"

---

#### GET /api/getAllInvoices
Retrieves all invoices for the user, with optional search and pagination. (Requires authentication)
**Request**: Query parameters `?page=0&size=10&terms=Client`
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Retrieved all paginated searched invoices successfully",
  "data": [
    {
      "id": "60d0fe4f5311236168a109cf",
      "shareable": "https://link-to-view-invoice.com/...",
      "customer": "Client Name",
      "currency": "USD",
      "issueDate": "2023-11-01T00:00:00.000Z",
      "dueDate": "2023-11-15T00:00:00.000Z",
      "Status": "draft"
    }
  ]
}
```
**Errors**:
- `500`: "Server error"

---

#### PUT /api/invoices/:id
Updates an existing invoice by its ID. (Requires authentication)
**Request**:
```json
{
  "status": "pending",
  "amount": 2000
}
```
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Invoice updated successfully",
  "data": { ...updatedInvoiceObject }
}
```
**Errors**:
- `404`: "Invoice not found"
- `500`: "Server error"

---

#### DELETE /api/invoices/:id
Deletes an invoice by its ID. (Requires authentication)
**Request**: (No payload)
**Response** (Success 200):
```json
{
  "status": 200,
  "message": "Invoice deleted successfully",
  "data": {}
}
```
**Errors**:
- `404`: "Invoice not found"
- `500`: "Server error"

---

#### **Webhooks**

#### POST /api/webhooks/paystack
Handles incoming webhook events from Paystack to confirm transactions.
**Request**: (Payload provided by Paystack)
**Response** (Success 200): (No body, just status code)
**Errors**:
- `401`: "Invalid signature"

## License

This project is open-source. Feel free to use and modify it.

## Author

**Noibisjunior**

-   **GitHub**: [@Noibisjunior](https://github.com/Noibisjunior)
-   **Twitter**: [@ClericCoder](https://x.com/clericcoder)
-   **LinkedIn**: [Abdulsalaam-noibi](https://linkedin.com/in/abdulsalaam-noibi)

<br/>

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)