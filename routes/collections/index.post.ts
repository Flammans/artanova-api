import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {title} = await readValidatedBody(event, z.object({
    title: z.string(),
  }).parse);
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collection = await prisma.collection.create({
    data: {
      title,
      userId: user.id,
    },
  });

  return collection;
});
