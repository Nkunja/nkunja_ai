import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
const uri = process.env.MONGO_URI as string;

const client = new MongoClient(uri);
export const clientPromise = client.connect();

export async function connectDb() {
  try {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to the database');
        return mongoose.connection.db;
    }
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri);
    console.log('Mongoose connection established');

    return (await clientPromise).db();
  } finally {
    // Ensures that the client will close when you finish/error
    console.log('connection closed');
  }
}