import { PrismaClient } from '@prisma/client';
import app from './app';

const prisma = new PrismaClient();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

(async () => {
  try {
    await prisma.$connect();
    console.log('🔗 Connected to database');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down...');
    await prisma.$disconnect();
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
