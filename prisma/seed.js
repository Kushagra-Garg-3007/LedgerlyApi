const prisma = require("../src/config/prisma");

async function main() {
  const defaultCategories = [
    "Food",
    "Salary",
    "Rent",
    "Travel",
    "Shopping",
    "Bills / Recharge",
    "Investment",
    "Stock",
    "SIP",
    "FD",
    "MISC",
  ];

  const rows = defaultCategories.map((name) => ({
    name,
    userId: null,
  }));

  await prisma.category.createMany({
    data: rows,
    skipDuplicates: true,
  });

  console.log("Default categories inserted");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
