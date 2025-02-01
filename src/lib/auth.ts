import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      street: {
        type: "string",
        required: true,
      },
      houseNumber: {
        type: "string",
        required: true,
      },
      postalCode: {
        type: "string",
        required: true,
      },
      city: {
        type: "string",
        required: true,
      },
      geoLocation: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: [
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  ],
});
