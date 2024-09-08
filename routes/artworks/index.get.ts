import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().positive().default(10),
    cursor: z.string().optional(),
  }).parse);

  const prisma = usePrisma();

  const artworks = await prisma.artwork.findMany({
    take: query.limit,
    cursor: query.cursor ? {
      id: query.cursor,
    } : undefined,
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      images: true,
    },
  });

  return {
    artworks,
  };
});
