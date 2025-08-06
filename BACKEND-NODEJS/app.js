const express = require('express');
const cors = require('cors')
require('dotenv').config();
const cookieParser = require ('cookie-parser');
const webhookRoutes = require('./routes/webhook');


const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use('/api/webhooks/paystack', webhookRoutes);
app.use(express.json());
app.use(cookieParser());




module.exports = app;
