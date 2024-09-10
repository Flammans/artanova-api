import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {uuid} = await getValidatedRouterParams(event, z.object({
    uuid: z.string().uuid(),
  }).parse);
  const {title, elementIds} = await readValidatedBody(event, z.object({
    title: z.string(),
    elementIds: z.number().array(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      uuid,
      userId: user.id,
    },
  });

  await prisma.collection.update({
    where: {
      id: collection.id,
    },
    data: {
      title: title,
    },
  });

  let sortValue = elementIds.length;
  for (const elementId of elementIds) {
    await prisma.element.update({
      where: {
        id: elementId,
        collectionId: collection.id,
      },
      data: {
        sort: sortValue--,
      },
    });
  }

  await prisma.element.deleteMany({
    where: {
      collectionId: collection.id,
      NOT: {
        id: {
          in: elementIds,
        },
      },
    },
  });

  return;
});
