export default defineEventHandler(async (event) => {
  const groups = await usePrisma().artwork.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
    where: {
      type: {
        not: null,
      },
    },
    orderBy: {
      _count: {
        type: 'desc',
      },
    },
  });

  const result = {};

  for (const group of groups) {
    result[group.type] = group._count.type;
  }

  return result;
});
