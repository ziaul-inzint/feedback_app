import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to database");
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully", db);
  } catch (error) {
    console.log("DB Connection Failed", error);
    process.exit();
  }
};
