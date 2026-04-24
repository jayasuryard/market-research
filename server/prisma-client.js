const { PrismaClient } = require('./generated/prisma');

// Create a single instance of PrismaClient
const prisma = new PrismaClient();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
