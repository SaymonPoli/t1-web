import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const user = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoDb = process.env.MONGO_DB;

if (!user || !password || !mongoDb) {
  console.error(
    "não foi possível carregar as variáveis de ambiente do banco de dados",
  );
  process.exit(1);
}

const uri = `mongodb://${user}:${password}@localhost:27017/${mongoDb}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("conexão com MongoDB completa");
  } catch (err) {
    console.error("falha o conectar no MongoDB:", err.message);
    process.exit(1);
  }
};

export { connectDB, mongoose };
export default connectDB;
