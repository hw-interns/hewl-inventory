import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
