import NextAuth, { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise, connectDb } from "../../../lib/connectDb";
import User from "../../../lib/models/userModel";
import { verifyPassword } from "../../../utils/auth";

// Ensure database connection
connectDb();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        return { id: user._id.toString(), email: user.email, name: user.name };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);