import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().cuid(),
  }).parse);
  const prisma = usePrisma();

  const collection = await prisma.collection.findUniqueOrThrow({
    where: {
      id: params.id,
    },
    include: {
      elements: {
        include: {
          artwork: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  return collection;
});
