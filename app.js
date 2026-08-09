import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./swagger.js";


import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const connectDB = async () => {
  const mongoURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URI_ATLAS
      : process.env.MONGODB_URI_LOCAL;

  if (!mongoURI) {
    throw new Error(
      "No se encontró una URI de MongoDB en las variables de entorno."
    );
  }

  await mongoose.connect(mongoURI);

  console.log(
    `✅ Conectado a MongoDB (${process.env.NODE_ENV || "development"})`
  );
};

export default app;
