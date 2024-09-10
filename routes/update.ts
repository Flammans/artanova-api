import {z} from 'zod';

export default defineEventHandler(async (event) => {
  const {source} = await getValidatedQuery(event, z.object({
    source: z.string().optional(),
  }).parse);

  runTask('update', {
    payload: {
      source,
    },
  });

  return 'OK';
});
