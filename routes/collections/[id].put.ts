import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().cuid(),
  }).parse);
  const body = await readValidatedBody(event, z.object({
    title: z.string(),
    elements: z.number().array(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  await prisma.collection.update({
    where: {
      id: collection.id,
    },
    data: {
      title: body.title,
    },
  });

  let i = 0;
  for (const elementId of body.elements) {
    await prisma.element.update({
      where: {
        id: elementId,
        collectionId: collection.id,
      },
      data: {
        sort: i++,
      },
    });
  }

  await prisma.element.deleteMany({
    where: {
      collectionId: collection.id,
      NOT: {
        id: {
          in: body.elements,
        },
      },
    },
  });

  return {};
});
