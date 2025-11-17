const express = require('express');
const cors = require('cors')
require('dotenv').config();
const cookieParser = require ('cookie-parser');
const webhookRoutes = require('./routes/webhook');


const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/webhooks/paystack', webhookRoutes);
app.use(express.json());
app.use(cookieParser());




module.exports = app;
