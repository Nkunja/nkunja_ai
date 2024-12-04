import mongoose from 'mongoose';

const uri = process.env.MONGO_URI as string;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

interface GlobalWithMongoose extends Global {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare const global: GlobalWithMongoose;

const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('Mongoose connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}