import { betterAuth } from "better-auth";
import { Pool } from "pg";
import Database from "better-sqlite3";

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {}),

  ...(process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          scope: ["user:email"],
        },
      }
    : {}),
};

// Local development: SQLite
// Production: PostgreSQL through DATABASE_URL
const database = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : new Database("./database.sqlite");

export const auth = betterAuth({
  database,

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3001",

  trustedOrigins: [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],

  secret:
    process.env.BETTER_AUTH_SECRET ||
    "local-development-secret-change-in-production",

  emailAndPassword: {
    enabled: true,
  },

  socialProviders,

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  user: {
    additionalFields: {},
  },
});

