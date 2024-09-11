export default defineEventHandler(async (event) => {
  const groups = await usePrisma().artwork.groupBy({
    by: ['origin'],
    _count: {
      origin: true,
    },
    where: {
      AND: [
        {
          origin: {
            not: null,
          },
        },
        {
          origin: {
            not: '',
          },
        },
      ],
    },
    orderBy: {
      _count: {
        origin: 'desc',
      },
    },
  });

  const result = {};

  for (const group of groups) {
    result[group.origin] = group._count.origin;
  }

  return result;
});
