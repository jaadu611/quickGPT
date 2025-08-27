import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("database connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`);
  } catch (error) {
    console.error(error.message);
  }
};
