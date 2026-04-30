import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./src/config/db.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

// 1. Carrega as variáveis de ambiente do arquivo .env
configDotenv();

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

async function startServer() {
  // 2. Conecta ao banco de dados
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
