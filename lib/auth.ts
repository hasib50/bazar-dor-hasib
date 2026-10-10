
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "@/lib/mongodb";

const authSecret = process.env.BETTER_AUTH_SECRET;

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ["user:email"],
        },
      }
    : {}),
};

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  appName: "Bazar-Dor",
  database: mongodbAdapter(db, { client }),
  secret: authSecret,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://bazar-dor-hasib.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders,
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});
