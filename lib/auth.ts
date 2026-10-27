import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET harus minimal 32 karakter");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL belum diisi di .env");
}

export const auth = betterAuth({
  secret,
  baseURL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields:{
        role:{
            type:["USER","ADMIN"],
            required:false,
            defaultValue:"USER",
            input:false
        }
    }
  }
});
