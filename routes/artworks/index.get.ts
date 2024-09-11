import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';
import {Artwork} from '@prisma/client';

const searchFields: Array<keyof Artwork> = [
  'title',
  'medium',
  'creditLine',
  'origin',
];

const sortFields: Array<keyof Artwork> = [
  'updatedAt',
  'yearFrom',
  'yearTo',
];

export default defineEventHandler(async (event) => {
  const {limit, cursor, query, sort, order} = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().positive().max(1_000).default(10),
    cursor: z.number().optional(),
    query: z.string().optional(),
    sort: z.enum(sortFields as any).default('updatedAt'),
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
      [sort]: {
        not: null,
      },
      ...(query ? {
        OR: searchFields.map((field) => ({
          [field]: {
            search: query,
          },
        })),
      } : {}),
    },
  });

  return artworks;
});
