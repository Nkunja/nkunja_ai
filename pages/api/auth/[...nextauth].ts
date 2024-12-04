// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "../../../lib/connectDb";
// import User from "../../../lib/models/userModel";
// import { verifyPassword } from "../../../utils/auth";

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   adapter: MongoDBAdapter(clientPromise) as any,
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         try {
//           if (!credentials?.email || !credentials?.password) {
//             return null;
//           }
//           const user = await User.findOne({ email: credentials.email });
//           if (!user) {
//             return null;
//           }
//           const isValid = await verifyPassword(credentials.password, user.password);
//           if (!isValid) {
//             return null;
//           }
//           return { id: user._id.toString(), email: user.email, name: user.name };
//         } catch (error) {
//           console.error('Authorization error:', error);
//           return null;
//         }
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt"
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// export default NextAuth(authOptions);