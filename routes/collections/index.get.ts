export default defineEventHandler(async (event) => {
  const user = await useUser().getFromEvent(event);
  const prisma = usePrisma();

  const collections = prisma.collection.findMany({
    where: {
      userId: user.id,
    },
  });

  return collections;
});
