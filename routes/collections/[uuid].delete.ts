import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {uuid} = await getValidatedRouterParams(event, z.object({
    uuid: z.string().uuid(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  await prisma.collection.delete({
    where: {
      uuid,
      userId: user.id,
    },
  });

  return;
});
