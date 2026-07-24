import dotenv from "dotenv"


import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksrouter from './routes/mocks.router.js'



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_ATLAS
    : process.env.MONGODB_URI_LOCAL;

mongoose.connect(MONGO_URI)
  .then(() => console.log(`✅ Conectado a MongoDB (${process.env.NODE_ENV})`))
  .catch(err => console.error("❌ Error MongoDB:", err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksrouter )

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
