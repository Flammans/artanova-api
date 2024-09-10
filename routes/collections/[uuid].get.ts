import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {uuid} = await getValidatedRouterParams(event, z.object({
    uuid: z.string().uuid(),
  }).parse);
  const prisma = usePrisma();

  const collection = await prisma.collection.findUniqueOrThrow({
    where: {
      uuid,
    },
    include: {
      elements: {
        include: {
          artwork: true,
        },
      },
    },
  });

  return collection;
});
