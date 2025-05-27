import { PrismaClient } from '@prisma/client';

// Create a new Prisma Client instance to interact with the database
// This instance can be used to perform database operations throughout the application
const prisma = new PrismaClient();

export default prisma;
