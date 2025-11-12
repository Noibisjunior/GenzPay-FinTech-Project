# GenzPay - Modern FinTech Platform

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

GenzPay is a comprehensive, modern financial technology platform built with a full-stack architecture. It provides users with powerful tools for digital wallet management, invoice creation, virtual card services, and seamless transaction handling. The platform combines a robust Node.js backend with a sleek Vue.js frontend to deliver a professional banking experience.

## Architecture Overview

This is a **monorepo** containing two main applications:

- **Backend** (`BACKEND-NODEJS/`): RESTful API built with Node.js, Express.js, and MongoDB
- **Frontend** (`FRONT-END-VUEJS/`): Modern SPA built with Vue.js 3, TypeScript, and Tailwind CSS

## Key Features

### User Experience
- **Secure Authentication**: JWT-based auth with email verification and password reset
- **Intuitive Dashboard**: Central hub for financial overview and quick actions
- **Multi-Currency Support**: Handle USD, NGN, EUR, GBP with real-time exchange rates
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices

### Financial Services
- **Digital Wallets**: Create, fund, and manage multi-currency wallets
- **Money Transfers**: Send funds locally with currency conversion
- **Virtual Cards**: Create and manage secure virtual debit/credit cards
- **Invoice Management**: Professional invoicing system with status tracking
- **Transaction History**: Comprehensive, searchable transaction logs

### Security & Integration
- **Payment Gateways**: Integrated with Paystack and Flutterwave
- **Email Services**: OTP verification and notifications via Nodemailer
- **Data Encryption**: Secure card data storage and transmission
- **API Security**: JWT authentication with protected routes

## Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cluster)
- **Git**

### Installation & Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Noibisjunior/GenzPay-FinTech-Project.git
    cd GenzPay-FinTech-Project
    ```

2. **Backend Setup**:
    ```bash
    cd BACKEND-NODEJS
    npm install
    ```
    
    Create a `.env` file with the required environment variables (see Backend Configuration below).
    
    ```bash
    npm run dev
    ```
    The backend will run on `http://localhost:8009`

3. **Frontend Setup** (in a new terminal):
    ```bash
    cd FRONT-END-VUEJS
    npm install
    ```
    
    The frontend is pre-configured to connect to the production backend. For local development, update the `.env` file:
    ```env
    VITE_API_BASE_URL=http://localhost:8009
    ```
    
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173`

## Project Structure

```
GenzPay-FinTech-Project/
├── BACKEND-NODEJS/           # Node.js API server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── package.json
├── FRONT-END-VUEJS/         # Vue.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable Vue components
│   │   ├── pages/           # Page components
│   │   ├── router/          # Vue Router configuration
│   │   └── main.ts          # Application entry point
│   ├── public/              # Static assets
│   └── package.json
├── README.md                # This file
└── .gitignore               # Git ignore rules
```

## Backend Configuration

### Environment Variables

Create a `.env` file in the `BACKEND-NODEJS` directory:

```env
# Server Configuration
PORT=8009
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/genzpay?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES=1d

# Email Service (Nodemailer/Gmail)
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_MAIL=youremail@gmail.com
SMPT_APP_PASS=your_gmail_app_password

# Payment Gateway Keys
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
FLW_SECRET_KEY=FLWSECK_TEST_your_flutterwave_secret_key
FLW_WEBHOOK_SECRET=your_flutterwave_webhook_secret_hash

# External Services
EXCHANGE_RATE_API_KEY=your_exchangerate_api_key

# Data Encryption
CARD_ENCRYPTION_KEY=your_32_character_card_encryption_key
```

### Available Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

## Frontend Configuration

### Environment Variables

Create a `.env` file in the `FRONT-END-VUEJS` directory:

```env
# API Configuration
VITE_API_BASE_URL=https://genzpay-fintech-backend.vercel.app
```

For local development:
```env
VITE_API_BASE_URL=http://localhost:8009
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## API Documentation

### Base URL
- **Development**: `http://localhost:8009`
- **Production**: `https://genzpay-fintech-backend.vercel.app`

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/me` - Get current user profile
- `GET /api/verify-otp` - Email verification
- `POST /api/resend-otp` - Resend verification code

#### Wallets & Transactions
- `GET /api/balance` - Get wallet balances
- `POST /api/wallets` - Create new wallet
- `POST /api/payment/initiate` - Initiate payment
- `GET /api/verify-payment` - Verify payment
- `GET /api/transactions` - Get transaction history
- `GET /api/exchange-rates` - Get exchange rates

#### Cards
- `POST /api/createCard` - Create virtual card
- `GET /api/getAllCards` - Get user cards
- `DELETE /api/card/:id` - Delete card

#### Invoices
- `POST /api/userInvoices` - Create invoice
- `GET /api/getAllInvoices` - Get user invoices
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

For detailed API documentation with request/response examples, see the [Backend API Documentation](./BACKEND-NODEJS/README.md).

## Technology Stack Used

### Backend Technologies
| Technology | Description |
|------------|-------------|
| **Node.js** | JavaScript runtime for server-side development |
| **Express.js** | Fast, unopinionated web framework for Node.js |
| **MongoDB** | NoSQL database for flexible data storage |
| **Mongoose** | Elegant MongoDB object modeling for Node.js |
| **JWT** | JSON Web Tokens for secure authentication |
| **Bcrypt/Argon2** | Password hashing for security |
| **Paystack/Flutterwave** | Payment processing integrations |
| **Nodemailer** | Email sending service |
| **Axios** | HTTP client for external API calls |

### Frontend Technologies
| Technology | Description |
|------------|-------------|
| **Vue.js 3** | Progressive JavaScript framework for building UIs |
| **TypeScript** | Typed JavaScript for enhanced development experience |
| **Vite** | Fast build tool and development server |
| **Vue Router** | Official routing library for Vue.js |
| **Tailwind CSS** | Utility-first CSS framework for rapid styling |
| **shadcn-vue** | Re-usable components built with Radix Vue |
| **VeeValidate/Zod** | Form validation with schema-based validation |
| **Axios** | Promise-based HTTP client for API requests |

## Deployment

### Backend Deployment

The backend is deployed on Vercel and accessible at: `https://genzpay-fintech-backend.vercel.app`

### Frontend Deployment

For production deployment:

1. **Build the application**:
    ```bash
    cd FRONT-END-VUEJS
    npm run build
    ```

2. **Deploy to Vercel/Netlify**:
    - Connect your repository to Vercel or Netlify
    - Set the `VITE_API_BASE_URL` environment variable to the production backend URL
    - Deploy automatically on push to main branch

## Testing

### Backend Testing
```bash
cd BACKEND-NODEJS
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Frontend Testing
```bash
cd FRONT-END-VUEJS
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:coverage  # Generate coverage report
```

## Contributing

We welcome contributions to the GenzPay platform! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is open-source and available under the [MIT License](LICENSE).

## Author

**Noibisjunior**

- **GitHub**: [@Noibisjunior](https://github.com/Noibisjunior)
- **Twitter**: [@ClericCoder](https://x.com/clericcoder)
- **LinkedIn**: [Abdulsalaam-noibi](https://linkedin.com/in/abdulsalaam-noibi)

## Acknowledgments

- Paystack and Flutterwave for payment gateway services
- Vue.js and Express.js communities for excellent frameworks
- All contributors who help improve this project

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Noibisjunior/GenzPay-FinTech-Project/issues) page
2. Create a new issue with detailed information

---

<div align="center">
  <strong>⭐ Please Star this repository if it helped you! ⭐</strong>
</div>

<br/>

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)