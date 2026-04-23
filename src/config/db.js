import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";

configDotenv();

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoDb = process.env.MONGO_DB;

if (!user || !password || !mongoDb) {
	console.log("can't load db enviroment variables");
	process.exit(1);
}

const safeUser = encodeURIComponent(user);
const safePassword = encodeURIComponent(password);
const uri = `mongodb://${safeUser}:${safePassword}@localhost:27017`;

const client = new MongoClient(uri);

try {
	await client.connect();
	console.log("successfuly connected to mongo client");
} catch (err) {
	console.error("failed to connect to client");
}

export const db = client.db(mongoDb);
export default client;


