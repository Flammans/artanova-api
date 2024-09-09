import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().cuid(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  await prisma.collection.delete({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  return {};
});
