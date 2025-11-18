require('dotenv').config();
const app = require('./app');
const connectDB = require('./Database/connect');

const PORT = process.env.PORT || 8009;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Server startup error:", err);
  }
};

start();
