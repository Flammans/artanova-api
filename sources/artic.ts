import {Artwork, Image} from '~/plugins/db';

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
      artwork.url = `${response.config.website_url}/artworks/${item.id}`;
      artwork.creditLine = item.credit_line;
      artwork.date = item.date_display;
      artwork.origin = item.place_of_origin;
      artwork.medium = item.medium_display;

      await artwork.save();

      for (const imageId of [item.image_id, ...item.alt_image_ids]) {
        if (!imageId) {
          continue;
        }

        const [image] = await Image.findOrBuild({
          where: {
            artworkId: artwork.id,
            sourceId: imageId,
          },
        });

        image.urlPreview = `${response.config.iiif_url}/${imageId}/full/843,/0/default.jpg`;
        image.urlFull = `${response.config.iiif_url}/${imageId}/full/full/0/default.jpg`;
        await image.save();
      }
    }

    if (page === response.pagination.total_pages || (page + 1) * limit > 10_000) {
      return;
    }

    await useWait(1_000);
    page++;
  }
};
