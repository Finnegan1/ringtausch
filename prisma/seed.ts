import { Item, Loan, PrismaClient } from "@prisma/client";

import { Faker, UserAccount } from "./faker";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const USER_COUNT = 100;
const ITEM_COUNT = 1000;
const LOAN_COUNT = 3000;

async function main(): Promise<void> {
  const faker = new Faker();

  const userAccounts = await faker.generateUserAccounts(USER_COUNT);
  console.log(`Generated ${userAccounts.length} user accounts`);
  const items = await faker.generateItems(ITEM_COUNT);
  console.log(`Generated ${items.length} items`);
  const loans = faker.generateLoans(LOAN_COUNT);
  console.log(`Generated ${loans.length} loans`);

  console.log(userAccounts[0].user);
  await addUserAccountsToDatabase(userAccounts);
  await addItemsToDatabase(items);
  await addLoansToDatabase(loans);
}

async function addUserAccountsToDatabase(userAccounts: UserAccount[]) {
  for (let i = 0; i < USER_COUNT; i++) {
    if (!(i % 50)) {
      console.log(`Added ${i} user accounts to the database`);
    }
    const { user, account } = userAccounts[i];
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

async function addItemsToDatabase(items: Item[]) {
  for (let i = 0; i < ITEM_COUNT; i++) {
    if (!(i % 50)) {
      console.log(`Added ${i}/${ITEM_COUNT} items to the database`);
    }
    try {
      await prisma.item.upsert({
        where: { id: items[i].id },
        update: items[i],
        create: items[i],
      });
    } catch (e) {
      console.error(e);
    }
  }
}

async function addLoansToDatabase(loans: Loan[]) {
  for (let i = 0; i < LOAN_COUNT; i++) {
    if (!(i % 50)) {
      console.log(`Added ${i}/${LOAN_COUNT} loans to the database`);
    }
    try {
      await prisma.loan.upsert({
        where: { id: loans[i].id },
        update: loans[i],
        create: loans[i],
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
