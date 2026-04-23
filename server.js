import express from "express";
import client from "./src/config/db.js";

const app = express();
const PORT = 3000;

async function startServer() {
	try {
		// 1. Tenta conectar
		await client.connect();

		// 2. Envia um "ping" para o banco de dados para confirmar a saúde da conexão
		await client.db("admin").command({ ping: 1 });
		console.log("✅ Conexão com MongoDB estabelecida com sucesso!");

		// 3. Só inicia o servidor se a conexão acima funcionar
		app.listen(PORT, () => {
			console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
		});

	} catch (error) {
		console.error("❌ Falha ao conectar no MongoDB:");
		console.error(error.message);
		process.exit(1); // Encerra o processo se não houver banco
	}
}

startServer();
