import { PrismaClient } from "@prisma/client";

import { Faker } from "./faker";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const USER_COUNT = 9500;

async function main(): Promise<void> {
  const faker = new Faker();
  for (let i = 0; i < USER_COUNT; i++) {
    const user = await faker.generateUser();
    await prisma.user.create({
      data: user,
    });
    if (!(i % 100)) {
      console.log(`Created ${i} users`);
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
