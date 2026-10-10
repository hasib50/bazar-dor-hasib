import dns from "node:dns";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is missing");

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function connect() {
  const promise = new MongoClient(uri!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  }).connect();

  // ফেইল করলে ক্যাশ মুছে দিন, যাতে পরের রিকোয়েস্টে আবার চেষ্টা হয়
  promise.catch(() => {
    globalForMongo.mongoClientPromise = undefined;
  });
  return promise;
}

const clientPromise = globalForMongo.mongoClientPromise ?? connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

export default clientPromise;