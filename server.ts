
import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import connectDB from './src/database/conncetion';

const startServer = async () => {
      await connectDB();
  const port = process.env.PORT || 6767;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();
