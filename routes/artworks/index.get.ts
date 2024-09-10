import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {limit, cursor, query} = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().positive().max(1_000).default(10),
    cursor: z.number().optional(),
    query: z.string().optional(),
  }).parse);

  const prisma = usePrisma();

  const artworks = await prisma.artwork.findMany({
    take: limit,
    cursor: cursor ? {
      id: cursor,
    } : undefined,
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      ...(query ? {
        OR: ['title', 'medium', 'creditLine', 'origin'].map((field) => ({
          [field]: {
            search: query,
          },
        })),
      } : {}),
    },
  });

  return artworks;
});
