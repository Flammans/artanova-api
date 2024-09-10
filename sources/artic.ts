import Bottleneck from 'bottleneck';

/** @see https://api.artic.edu/docs/ */
const sourceName = 'artic';
const baseURL = 'https://api.artic.edu/api/v1';
const limiter = new Bottleneck({
  minTime: 1_000, // 60 requests per minute
});

export default async function() {
  const prisma = usePrisma();

  const limit = 100;
  let page = 1;

  while (true) {
    const {data, config, pagination} = await limiter.schedule(() => $fetch<any>(`/artworks`, {
      baseURL,
      query: {
        // @TODO fields: 'id,title,...',
        page,
        limit,
      },
    }));

    for (const item of data) {
      await importItem(item, config);
    }

    if (page === pagination.total_pages || (page + 1) * limit > 10_000) {
      return;
    }

    page++;
  }
};

async function importItem (item: any, config: any) {
  if (!item.image_id) {
    return;
  }

  const artworkId = `${sourceName}:${item.id}`;
  const artworkAttributes = {
    title: item.title,
    description: item.description,
    url: `${config.website_url}/artworks/${item.id}`,
    creditLine: item.credit_line,
    date: item.date_display,
    origin: item.place_of_origin,
    medium: item.medium_display,
    preview: `${config.iiif_url}/${item.image_id}/full/843,/0/default.jpg`,
    images: [item.image_id, ...item.alt_image_ids]
        .map(imageId => `${config.iiif_url}/${imageId}/full/full/0/default.jpg`),
    updatedAt: item.updated_at,
  };

  await usePrisma().artwork.upsert({
    where: {
      id: artworkId,
    },
    create: {
      id: artworkId,
      ...artworkAttributes,
    },
    update: artworkAttributes,
    select: {
      id: true,
    },
  });
}
