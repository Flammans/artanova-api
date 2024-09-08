import {PrismaClient} from '@prisma/client';

let prisma: PrismaClient;

export function usePrisma (): PrismaClient {
  if (!prisma) {
    const config = useRuntimeConfig();

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
      log: ['info', 'query'],
    });

    useNitroApp().hooks.hookOnce('close', async () => {
      await prisma.$disconnect();
    });
  }

  return prisma;
}
