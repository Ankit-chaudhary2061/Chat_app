
import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';

const startServer = async () => {
  const port = process.env.PORT || 6767;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();
