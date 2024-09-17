import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';
import {Artwork} from '@prisma/client';

const searchFields: Array<keyof Artwork> = [
  'title',
  'medium',
  'origin',
  'artist',
  'type',
];

const sortFields: {
  [key in 'notNullable' | 'nullable']: Array<keyof Artwork>
} = {
  notNullable: [
    'updatedAt',
  ],
  nullable: [
    'yearFrom',
    'yearTo',
  ],
};

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().positive().max(1_000).default(10),
    cursor: z.number().optional(),
    search: z.string().optional(),
    sort: z.enum([...sortFields.nullable, ...sortFields.notNullable] as any).default('updatedAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    artist: z.string().optional(),
    origins: z.string().optional().transform((origins) => origins
        ? origins.split(',').map(origin => decodeURIComponent(origin))
        : undefined),
    yearFrom: z.coerce.number().optional(),
    yearTo: z.coerce.number().optional(),
    types: z.string().optional().transform((types) => types
        ? types.split(',').map(type => decodeURIComponent(type))
        : undefined),
  }).parse);

  const prisma = usePrisma();

  const artworks = await prisma.artwork.findMany({
    take: query.limit,
    cursor: query.cursor ? {
      id: query.cursor,
    } : undefined,
    orderBy: {
      [query.sort]: query.order,
    },
    where: {
      ...(sortFields.nullable.includes(query.sort) ? {
        NOT: {
          [query.sort]: null,
        },
      } : {}),
      ...(query.search ? {
        OR: searchFields.map((field) => ({
          [field]: {
            search: query.search,
          },
        })),
      } : {}),
      ...(query.artist ? {
        artist: {
          search: query.artist,
        },
      } : {}),
      ...(query.origins ? {
        origin: {
          in: query.origins,
        },
      } : {}),
      ...(query.types ? {
        type: {
          in: query.types,
        },
      } : {}),
      ...(query.yearFrom !== undefined ? {
        yearTo: {
          gte: query.yearFrom,
        },
      } : {}),
      ...(query.yearTo !== undefined ? {
        yearFrom: {
          lte: query.yearTo,
        },
      } : {}),
    },
  });

  return artworks;
});
