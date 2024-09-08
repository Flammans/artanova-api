import {defineEventHandler, getValidatedQuery} from 'h3';
import {z} from 'zod';
import {Artwork} from '~/plugins/db';

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  }).parse);

  const {count, rows: artworks} = await Artwork.findAndCountAll({
    offset: (query.page - 1) * query.limit,
    limit: query.limit,
    order: [['updatedAt', 'DESC']],
  });

  return {
    count,
    artworks,
  };
});
