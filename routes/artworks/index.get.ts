import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {limit, cursor, query, sort, order} = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().positive().max(1_000).default(10),
    cursor: z.number().optional(),
    query: z.string().optional(),
    sort: z.enum(['updatedAt']).default('updatedAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }).parse);

  const prisma = usePrisma();

  const artworks = await prisma.artwork.findMany({
    take: limit,
    cursor: cursor ? {
      id: cursor,
    } : undefined,
    orderBy: {
      [sort]: order,
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
