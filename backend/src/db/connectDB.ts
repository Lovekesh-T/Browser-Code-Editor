import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "replit",
    });
    console.log(`MongoDB connected sucessfully HOST: ${connection.host}`);
  } catch (error) {
    console.log("mongodb connection error");
    process.exit(1);
  }
};
