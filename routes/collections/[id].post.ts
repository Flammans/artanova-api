import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().cuid(),
  }).parse);
  const body = await readValidatedBody(event, z.object({
    artworkId: z.string(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      id: params.id,
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
