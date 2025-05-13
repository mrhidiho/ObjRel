import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Application = express();
const port = 3001;

app.use(express.json());

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database via Prisma');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

app.get('/', async (_req: Request, res: Response) => {
  const companies = await prisma.company.findMany();
  res.json({ message: 'Object Relations API with Prisma', companies });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
