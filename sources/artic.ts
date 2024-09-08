import {Artwork} from '~/plugins/db';

const sourceName = 'artic';
const baseURL = 'https://api.artic.edu/api/v1';

export default async function() {
  const limit = 100;
  let page = 1;

  while (true) {
    const response = await $fetch<any>(`/artworks`, {
      baseURL,
      query: {
        // @TODO fields: 'id,title,...',
        page,
        limit,
      },
    });

    for (const item of response.data) {
      const [artwork] = await Artwork.findOrBuild({
        where: {
          sourceName,
          sourceId: `${item.id}`,
        },
      });

      artwork.title = item.title;
      artwork.description = item.description;
      artwork.url = `https://www.artic.edu/artworks/${item.id}`;
      artwork.creditLine = item.credit_line;
      artwork.date = item.date_display;
      artwork.origin = item.place_of_origin;
      artwork.medium = item.medium_display;

      await artwork.save();
    }

    if (page === response.pagination.total_pages || (page + 1) * limit > 10_000) {
      return;
    }

    await useWait(1_000);
    page++;
  }
};
