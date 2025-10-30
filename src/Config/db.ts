import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URI;

export const connectDB = async () => {
  //   try {
  await mongoose
    .connect(`${MONGOURL}`)
    .then(() => {
      console.log("MONGODB CONNECTED ✅");
    })
    .catch((error: unknown) => {
      if (error instanceof Error) {
        console.log(`${error.name} : ${error.message}`);
      }
    });
  //   } catch (err) {
  //     console.error("MongoDB connection error:", err);
  //     process.exit(1);
  //   }
};
