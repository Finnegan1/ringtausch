import { PrismaClient } from "@prisma/client";

import { Faker } from "./faker";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const USER_COUNT = 9500;

async function main(): Promise<void> {
  const faker = new Faker();
  for (let i = 0; i < USER_COUNT; i++) {
    if (!(i % 50)) {
      console.log(`Created ${i} users`);
    }
    const { user, account } = await faker.generateUserAccount();
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      });
      await prisma.account.upsert({
        where: { id: account.id },
        update: account,
        create: account,
      });
    } catch (e) {
      console.error(e);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
