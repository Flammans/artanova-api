import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {uuid} = await getValidatedRouterParams(event, z.object({
    uuid: z.string().uuid(),
  }).parse);
  const body = await readValidatedBody(event, z.object({
    artworkId: z.number(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      uuid,
      userId: user.id,
    },
  });

  await prisma.element.create({
    data: {
      collectionId: collection.id,
      artworkId: body.artworkId,
    },
  });

  return;
});
