const app = require("./app");
const env = require("./config/env");
const prisma = require("./config/prisma");

async function bootstrap() {
  await prisma.$connect();

  app.listen(env.port, () => {
    console.log(`Ledgerly API running on port ${env.port}`);
  });
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
