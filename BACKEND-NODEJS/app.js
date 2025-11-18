const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const otherRoutes = require('./routes/otherRoute');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api', otherRoutes);
app.use('/api/webhooks/paystack', webhookRoutes);

module.exports = app;
