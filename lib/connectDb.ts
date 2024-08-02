import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
const uri = process.env.MONGO_URI as string;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  }
  await mongoose.connect(uri);
  console.log('Mongoose connection established');
  return mongoose.connection.db;
}