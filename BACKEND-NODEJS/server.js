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

// Deployment Fun Fact: If you make any code changes in a monorepo that contains both frontend and backend, dont forget to deploy the
// latest commit on both the frontend and backend server. 
