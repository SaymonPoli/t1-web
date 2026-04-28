import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import apiRoutes from "./src/routes/apiRoutes.js"; 
import authRoutes from "./src/routes/authRoutes.js";

// 1. Carrega as variáveis de ambiente do arquivo .env
configDotenv();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

async function startServer() {
    try {
        // 2. Puxa as credenciais seguras do .env (igual ao seu db.js)
        const user = encodeURIComponent(process.env.MONGO_USER);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);
        const mongoDb = process.env.MONGO_DB;

        // 3. Monta a URI do Mongoose com as credenciais e o nome do banco
        const uri = `mongodb://${user}:${password}@localhost:27017/${mongoDb}?authSource=admin`;

        // 4. Conecta usando o Mongoose
        await mongoose.connect(uri);
        
        console.log("✅ Conexão com MongoDB (Mongoose) estabelecida com sucesso!");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Falha ao conectar no MongoDB:");
        console.error(error.message);
        process.exit(1); 
    }
}

startServer();