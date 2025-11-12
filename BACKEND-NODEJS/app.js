const express = require('express');
const cors = require('cors')
require('dotenv').config();
const cookieParser = require ('cookie-parser');
const webhookRoutes = require('./routes/webhook');


const app = express();

app.use(
  cors({
    origin: 'https://genz-6cosnszb6-noibisjuniors-projects.vercel.app',
    credentials: true
  })
);
app.use('/api/webhooks/paystack', webhookRoutes);
app.use(express.json());
app.use(cookieParser());




module.exports = app;
