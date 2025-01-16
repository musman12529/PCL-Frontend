import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          // Make an API call to the Node.js backend for user authentication
          const response = await fetch("https://pcl-backend-pi.vercel.app/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error("Invalid email or password");
          }

          const user = await response.json();
          return user; // Return the user object on successful login
        } catch (err:any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider === "credentials") {
        return true; // Credentials login handled in `authorize`
      }

      if (account?.provider === "github") {
        try {
          // Make an API call to save GitHub user data in the backend
          const response = await fetch("https://pcl-backend-pi.vercel.app/api/auth/github", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (!response.ok) {
            console.error("Failed to save GitHub user in the backend");
            return false;
          }

          return true;
        } catch (err) {
          console.error("Error during GitHub sign-in", err);
          return false;
        }
      }
      return false;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
