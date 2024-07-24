import mongoose from 'mongoose';
const uri = process.env.MONGO_URI as string;

export async function connectDb() {
  try {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to the database');
        return;
    }
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri);
    console.log('connection established');
  } finally {
    // Ensures that the client will close when you finish/error
    console.log('connection closed');
  }
}

