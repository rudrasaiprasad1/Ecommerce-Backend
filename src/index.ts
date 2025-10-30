import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ProductRouter from "./Routes/Product.Route";
import { connectDB } from "./Config/db";

import authRoutes from "./Routes/Auth.Route";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());

// auth routes
app.use("/api/auth", authRoutes);

//product routes
app.use("/product", ProductRouter);

//connecting db
// connect DB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
